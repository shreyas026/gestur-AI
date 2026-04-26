import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

import LandingPage from "./components/Landing";
import LoginPage from "./components/LoginPage";

const API_BASE_URL = "http://localhost:5000";
const LOCAL_SESSION_KEY = "gesturai_auth";
const SESSION_STORAGE_KEY = "gesturai_auth_session";

const getVideoUrl = (path) => (path ? encodeURI(`${API_BASE_URL}${path}`) : "");

const syncVideoSource = (videoElement, nextSource) => {
  if (!videoElement) return;

  if (!nextSource) {
    if (videoElement.dataset.videoSrc) {
      videoElement.pause();
      videoElement.removeAttribute("src");
      videoElement.dataset.videoSrc = "";
      videoElement.load();
    }

    return;
  }

  if (videoElement.dataset.videoSrc !== nextSource) {
    videoElement.pause();
    videoElement.src = nextSource;
    videoElement.dataset.videoSrc = nextSource;
    videoElement.load();
  }
};

function getStoredSession() {
  const candidates = [
    window.localStorage.getItem(LOCAL_SESSION_KEY),
    window.sessionStorage.getItem(SESSION_STORAGE_KEY),
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }

  return null;
}

function saveSession(session, persist) {
  const serialized = JSON.stringify(session);

  if (persist) {
    window.localStorage.setItem(LOCAL_SESSION_KEY, serialized);
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
  window.localStorage.removeItem(LOCAL_SESSION_KEY);
}

function clearStoredSession() {
  window.localStorage.removeItem(LOCAL_SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

function getAuthConfig(token, extra = {}) {
  return {
    ...extra,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(extra.headers || {}),
    },
  };
}

function resolveAssetUrl(videoUrl) {
  if (!videoUrl) {
    return "";
  }

  return /^https?:\/\//i.test(videoUrl) ? videoUrl : `${API_BASE_URL}${videoUrl}`;
}

function resetSignDraft() {
  return { word: "", videoUrl: "" };
}

async function fetchCurrentUser(token) {
  const response = await axios.get(
    `${API_BASE_URL}/api/auth/me`,
    getAuthConfig(token),
  );

  return response.data.data.user;
}

async function fetchAdminSummary(token) {
  const response = await axios.get(
    `${API_BASE_URL}/api/auth/admin/summary`,
    getAuthConfig(token),
  );

  return response.data.data;
}

async function fetchAdminSigns(token) {
  const response = await axios.get(
    `${API_BASE_URL}/api/admin/signs`,
    getAuthConfig(token),
  );

  return response.data.signs;
}

async function fetchVideoAssets(token) {
  const response = await axios.get(
    `${API_BASE_URL}/api/admin/video-assets`,
    getAuthConfig(token),
  );

  return response.data.assets;
}

async function createAdminSign(token, payload) {
  const response = await axios.post(
    `${API_BASE_URL}/api/admin/signs`,
    payload,
    getAuthConfig(token),
  );

  return response.data.sign;
}

async function updateAdminSign(token, signId, payload) {
  const response = await axios.put(
    `${API_BASE_URL}/api/admin/signs/${signId}`,
    payload,
    getAuthConfig(token),
  );

  return response.data.sign;
}

async function deleteAdminSign(token, signId) {
  await axios.delete(
    `${API_BASE_URL}/api/admin/signs/${signId}`,
    getAuthConfig(token),
  );
}

async function uploadAdminVideo(token, file, word, onUploadProgress) {
  const formData = new FormData();
  formData.append("video", file);

  if (word) {
    formData.append("word", word);
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/admin/upload-video`,
    formData,
    getAuthConfig(token, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }),
  );

  return response.data.asset;
}

function App() {
  const [view, setView] = useState("landing");
  const [authChecking, setAuthChecking] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [adminSummary, setAdminSummary] = useState(null);
  const [adminSigns, setAdminSigns] = useState([]);
  const [videoAssets, setVideoAssets] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSummaryError, setAdminSummaryError] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [editingSignId, setEditingSignId] = useState("");
  const [signDraft, setSignDraft] = useState(resetSignDraft);
  const [signActionBusy, setSignActionBusy] = useState(false);
  const [signActionMessage, setSignActionMessage] = useState("");
  const [signActionError, setSignActionError] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [inputText, setInputText] = useState("");
  const [videoPlaylist, setVideoPlaylist] = useState([]);
  const [translationSegments, setTranslationSegments] = useState([]);
  const [unmatchedWords, setUnmatchedWords] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0);
  const [showDatabase, setShowDatabase] = useState(false);

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const filteredAdminSigns = adminSigns.filter((sign) => {
    const query = adminSearchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      sign.word.toLowerCase().includes(query) ||
      sign.videoUrl.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const storedSession = getStoredSession();

      if (!storedSession?.token) {
        if (isMounted) {
          setAuthChecking(false);
        }
        return;
      }

      try {
        const user = await fetchCurrentUser(storedSession.token);

        if (!isMounted) {
          return;
        }

        setAuthToken(storedSession.token);
        setAuthUser(user);
        setView("app");
      } catch {
        clearStoredSession();
      } finally {
        if (isMounted) {
          setAuthChecking(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      if (!authToken || authUser?.role !== "admin") {
        setAdminSummary(null);
        setAdminSigns([]);
        setVideoAssets([]);
        setAdminSummaryError("");
        setAdminLoading(false);
        return;
      }

      setAdminLoading(true);

      try {
        const [summary, signs, assets] = await Promise.all([
          fetchAdminSummary(authToken),
          fetchAdminSigns(authToken),
          fetchVideoAssets(authToken),
        ]);

        if (!isMounted) {
          return;
        }

        setAdminSummary(summary);
        setAdminSigns(signs);
        setVideoAssets(assets);
        setAdminSummaryError("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAdminSummary(null);
        setAdminSigns([]);
        setVideoAssets([]);
        setAdminSummaryError(
          error.response?.data?.message || "Could not load admin dashboard",
        );
      } finally {
        if (isMounted) {
          setAdminLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [authToken, authUser]);

  const refreshAdminSummary = async () => {
    if (!authToken || authUser?.role !== "admin") {
      return;
    }

    const summary = await fetchAdminSummary(authToken);
    setAdminSummary(summary);
  };

  const handleAuthSuccess = ({ token, user, persist }) => {
    saveSession({ token }, persist);
    setAuthToken(token);
    setAuthUser(user);
    setView("app");
  };

  const resetAdminMessages = () => {
    setSignActionMessage("");
    setSignActionError("");
    setUploadMessage("");
    setUploadError("");
  };

  const clearEditor = () => {
    setEditingSignId("");
    setSignDraft(resetSignDraft());
  };

  const handleLogout = () => {
    clearStoredSession();
    setAuthToken("");
    setAuthUser(null);
    setAdminSummary(null);
    setAdminSigns([]);
    setVideoAssets([]);
    setAdminSummaryError("");
    setAdminSearchQuery("");
    setSignActionBusy(false);
    setUploadBusy(false);
    setUploadProgress(0);
    resetAdminMessages();
    clearEditor();
    setVideoPlaylist([]);
    setTranslationSegments([]);
    setUnmatchedWords([]);
    setCurrentVideoIndex(0);
    setView("landing");
  };

  const handleSearch = async () => {
    if (!inputText.trim() || !authToken) return;

    setLoading(true);
    setVideoPlaylist([]);
    setTranslationSegments([]);
    setUnmatchedWords([]);
    setCurrentVideoIndex(0);
    setActivePlayer(0);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/search`,
        { sentence: inputText },
        getAuthConfig(authToken),
      );

      const { videos = [], segments = [], unmatchedWords: missing = [] } =
        response.data.data || {};

      setTranslationSegments(segments);
      setUnmatchedWords(missing);

      if (videos.length > 0) {
        setVideoPlaylist(videos);
      } else {
        alert("No signs found");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      alert(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDraftChange = (field, value) => {
    setSignDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAssetPick = (asset) => {
    resetAdminMessages();
    setSignDraft((current) => ({
      word: current.word || asset.label,
      videoUrl: asset.videoUrl,
    }));
  };

  const handleStartEdit = (sign) => {
    resetAdminMessages();
    setEditingSignId(sign.id);
    setSignDraft({
      word: sign.word,
      videoUrl: sign.videoUrl,
    });
  };

  const handleCancelEdit = () => {
    resetAdminMessages();
    clearEditor();
  };

  const handleSubmitSign = async (event) => {
    event.preventDefault();

    if (!authToken) {
      return;
    }

    setSignActionBusy(true);
    setSignActionMessage("");
    setSignActionError("");

    try {
      const nextSign = editingSignId
        ? await updateAdminSign(authToken, editingSignId, signDraft)
        : await createAdminSign(authToken, signDraft);

      if (editingSignId) {
        setAdminSigns((current) =>
          current.map((sign) => (sign.id === editingSignId ? nextSign : sign)),
        );
        setSignActionMessage(`Updated ${nextSign.word}.`);
      } else {
        setAdminSigns((current) => [nextSign, ...current]);
        setSignActionMessage(`Added ${nextSign.word} to the sign catalog.`);
      }

      clearEditor();
      await refreshAdminSummary();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      setSignActionError(
        error.response?.data?.error || "Could not save sign entry",
      );
    } finally {
      setSignActionBusy(false);
    }
  };

  const handleDeleteSign = async (signId) => {
    if (!authToken) {
      return;
    }

    setSignActionBusy(true);
    setSignActionMessage("");
    setSignActionError("");

    try {
      await deleteAdminSign(authToken, signId);

      setAdminSigns((current) => current.filter((sign) => sign.id !== signId));
      setSignActionMessage("Sign entry deleted.");

      if (editingSignId === signId) {
        clearEditor();
      }

      await refreshAdminSummary();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      setSignActionError(
        error.response?.data?.error || "Could not delete sign entry",
      );
    } finally {
      setSignActionBusy(false);
    }
  };

  const handleUploadVideo = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !authToken) {
      return;
    }

    setUploadBusy(true);
    setUploadProgress(0);
    setUploadMessage("");
    setUploadError("");

    try {
      const asset = await uploadAdminVideo(
        authToken,
        file,
        signDraft.word,
        (progressEvent) => {
          const total = progressEvent.total || file.size || 1;
          const percent = Math.round((progressEvent.loaded / total) * 100);
          setUploadProgress(percent);
        },
      );

      setVideoAssets((current) => [
        asset,
        ...current.filter((entry) => entry.videoUrl !== asset.videoUrl),
      ]);
      setSignDraft((current) => ({
        word: current.word || asset.label,
        videoUrl: asset.videoUrl,
      }));
      setUploadMessage(`Uploaded ${file.name} successfully.`);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      setUploadError(error.response?.data?.error || "Could not upload video");
    } finally {
      setUploadBusy(false);
    }
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < videoPlaylist.length - 1) {
      setActivePlayer((prev) => (prev === 0 ? 1 : 1 - prev));
      setCurrentVideoIndex((prev) => prev + 1);
    }
  };

  const isPlayer1Active = activePlayer === 0;
  const currentVid = videoPlaylist[currentVideoIndex];
  const draftVideoPreviewUrl = resolveAssetUrl(signDraft.videoUrl);

  useEffect(() => {
    const player1 = videoRef1.current;
    const player2 = videoRef2.current;

    if (videoPlaylist.length === 0) {
      [player1, player2].forEach((player) => syncVideoSource(player, ""));
      return;
    }

    const activeVideo = activePlayer === 0 ? player1 : player2;
    const bufferedVideo = activePlayer === 0 ? player2 : player1;
    const currentSource = getVideoUrl(videoPlaylist[currentVideoIndex]?.videoUrl);
    const nextSource = getVideoUrl(videoPlaylist[currentVideoIndex + 1]?.videoUrl);

    syncVideoSource(activeVideo, currentSource);
    syncVideoSource(bufferedVideo, nextSource);

    if (bufferedVideo) {
      bufferedVideo.currentTime = 0;
    }

    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch((error) => console.log("Autoplay blocked", error));
    }
  }, [activePlayer, currentVideoIndex, videoPlaylist]);

  if (authChecking) {
    return (
      <div className="app-main-container">
        <div className="app-bg-glow top-right"></div>
        <div className="app-bg-glow bottom-left"></div>
        <div className="auth-loading-shell">
          <div className="glass-auth-loading">
            <div className="spinner"></div>
            <p>Restoring your session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-main-container">
      <div className="app-bg-glow top-right"></div>
      <div className="app-bg-glow bottom-left"></div>

      {view === "landing" && (
        <LandingPage onEnter={() => setView(authUser ? "app" : "login")} authUser={authUser} />
      )}

      {view === "login" && !authUser && (
        <LoginPage
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setView("landing")}
        />
      )}

      {(view === "app" || view === "admin") && authUser && (
        <div className={`view-shell fade-in ${view === 'admin' ? 'admin-theme' : 'translator-theme'}`}>
          <nav className="app-nav">
            <div className="app-logo" style={{ cursor: "pointer" }} onClick={() => setView("landing")}>
              Gestur<span>AI</span>
            </div>

            <div className="auth-user-bar">
              <div className="account-chip">
                <span className="account-name">{authUser.name}</span>
                <span className="account-email">{authUser.email}</span>
              </div>
              <div
                className={`role-chip ${
                  authUser.role === "admin" ? "role-chip-admin" : ""
                }`}
              >
                {authUser.role}
              </div>
              {authUser.role === "admin" && (
                <button
                  className="switch-view-btn admin-secondary-btn"
                  style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: "8px" }}
                  onClick={() => setView(view === "admin" ? "app" : "admin")}
                >
                  {view === "admin" ? "Go to Translator" : "Admin Dashboard"}
                </button>
              )}
              <button className="logout-pill" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </nav>

          {view === "app" ? (
            <main className="translator-content">
              <section className="app-stage">
              <div className="translator-panel">
                <header className="translator-header">
                  <span className="panel-eyebrow">Real-Time AI Translation</span>
                  <h1>
                    Text to <span className="gradient-text">Sign Language</span>
                  </h1>
                  <p>
                    Type a sentence and watch GesturAI transform it into fluid
                    human signing without making you scroll down to see the
                    stage.
                  </p>
                </header>



                <div className="glass-search-container">
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="Type something to translate..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    type="button"
                    className="search-trigger"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? <div className="spinner"></div> : "Translate"}
                  </button>
                </div>

                <div className="quick-highlights">
                  <div className="highlight-chip">Protected Account Access</div>
                  <div className="highlight-chip">Upload-Ready Admin Studio</div>
                  <div className="highlight-chip">Authentic Human Signing</div>
                  {translationSegments.length > 0 && (
                    <div className="highlight-chip active-highlight">
                      Smart phrase matching enabled
                    </div>
                  )}
                </div>

                {(translationSegments.length > 0 || unmatchedWords.length > 0) && (
                  <div className="translation-insights">
                    {translationSegments.length > 0 && (
                      <div className="insight-panel">
                        <span className="insight-label">Matched Sequence</span>
                        <div className="insight-chip-list">
                          {translationSegments.map((segment, index) => (
                            <div
                              className="insight-chip"
                              key={`${segment.word}-${index}`}
                            >
                              <strong>{segment.matchedWord}</strong>
                              <span>{segment.source.replace("-", " ")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {unmatchedWords.length > 0 && (
                      <div className="insight-panel warning-panel">
                        <span className="insight-label">Needs More Signs</span>
                        <div className="insight-chip-list">
                          {unmatchedWords.map((word, index) => (
                            <div
                              className="insight-chip warning-chip"
                              key={`${word}-${index}`}
                            >
                              {word}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="video-viewport-container">
                {videoPlaylist.length > 0 ? (
                  <div className="video-card fade-in">
                    <div className="video-info-overlay">
                      <span className="word-badge">{currentVid?.word}</span>
                      <span className="index-badge">
                        {currentVideoIndex + 1} / {videoPlaylist.length}
                      </span>
                    </div>

                    <div className="video-stack">
                      <video
                        ref={videoRef1}
                        muted
                        preload="auto"
                        playsInline
                        onEnded={handleVideoEnd}
                        className={`video-layer ${
                          isPlayer1Active ? "active" : "hidden"
                        }`}
                      />
                      <video
                        ref={videoRef2}
                        muted
                        preload="auto"
                        playsInline
                        onEnded={handleVideoEnd}
                        className={`video-layer ${
                          !isPlayer1Active ? "active" : "hidden"
                        }`}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </main>
          ) : view === "admin" ? (
            <main className="admin-dashboard-content fade-in">
              <div className="admin-page-header">
                <h1>Admin Dashboard</h1>
                <p>Manage the GesturAI system, monitor catalog, and control user access across the platform.</p>
              </div>

              {adminLoading ? (
                <p className="admin-error-copy" style={{textAlign: "center", marginTop: "2rem"}}>Loading admin dashboard...</p>
              ) : adminSummary ? (
                <div className="admin-dashboard-layout">
                  <div className="admin-stat-grid dashboard-wide-stats">
                    <div className="admin-stat-card">
                      <strong>{adminSummary.totalUsers}</strong>
                      <span>Total users</span>
                    </div>
                    <div className="admin-stat-card">
                      <strong>{adminSummary.totalAdmins}</strong>
                      <span>Admins</span>
                    </div>
                    <div className="admin-stat-card">
                      <strong>{adminSigns.length}</strong>
                      <span>Catalog entries</span>
                    </div>
                    <div className="admin-stat-card">
                      <strong>{videoAssets.length}</strong>
                      <span>Uploaded assets</span>
                    </div>
                  </div>

                  <div className="admin-dashboard-grid-main">
                    <div className="admin-db-left">
                      
                    <div className="admin-panel" style={{ height: '100%', overflowY: 'auto' }}>
                      <div className="admin-panel-header">
                        <span className="insight-label">Admin Studio</span>
                        <span className="admin-panel-tag">Upload + manage signs</span>
                      </div>

                      <div className="admin-subsection">
                        <div className="admin-subsection-header">
                          <span className="insight-label">
                            {editingSignId ? "Edit Sign" : "Create Sign"}
                          </span>
                          <small>
                            Upload a clip, preview it, then save the word or phrase.
                          </small>
                        </div>

                        <div className="upload-panel">
                          <label className="upload-dropzone">
                            <input
                              type="file"
                              accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
                              className="upload-input"
                              onChange={handleUploadVideo}
                              disabled={uploadBusy}
                            />
                            <strong>
                              {uploadBusy ? "Uploading video..." : "Upload video file"}
                            </strong>
                            <span>
                              Supports `.mp4`, `.webm`, and `.mov` up to 100 MB.
                            </span>
                          </label>

                          <div className="upload-status-card">
                            <span className="insight-label">Upload Status</span>
                            <strong>{uploadBusy ? `${uploadProgress}%` : "Ready"}</strong>
                            <small>
                              {uploadMessage || uploadError || "Choose a local file to add it into the video catalog."}
                            </small>
                            {uploadBusy && (
                              <div className="upload-progress-track">
                                <div
                                  className="upload-progress-bar"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>

                        <form className="admin-sign-form" onSubmit={handleSubmitSign}>
                          <div className="admin-form-grid">
                            <label className="admin-field">
                              <span>Word or phrase</span>
                              <input
                                type="text"
                                value={signDraft.word}
                                onChange={(event) =>
                                  handleDraftChange("word", event.target.value)
                                }
                                placeholder="Good morning"
                                required
                              />
                            </label>

                            <label className="admin-field">
                              <span>Video URL</span>
                              <input
                                type="text"
                                value={signDraft.videoUrl}
                                onChange={(event) =>
                                  handleDraftChange("videoUrl", event.target.value)
                                }
                                placeholder="/videos/good-morning.mp4"
                                required
                              />
                            </label>
                          </div>

                          {draftVideoPreviewUrl && (
                            <div className="draft-preview-card">
                              <div className="draft-preview-copy">
                                <span className="insight-label">Preview</span>
                                <strong>{signDraft.word || "Pending label"}</strong>
                                <small>{signDraft.videoUrl}</small>
                              </div>
                              <video
                                className="draft-preview-video"
                                src={draftVideoPreviewUrl}
                                controls
                                playsInline
                              />
                            </div>
                          )}

                          <div className="admin-form-actions">
                            <button
                              type="submit"
                              className="admin-primary-btn"
                              disabled={signActionBusy || uploadBusy}
                            >
                              {signActionBusy
                                ? "Saving..."
                                : editingSignId
                                  ? "Update Sign"
                                  : "Add Sign"}
                            </button>
                            <button
                              type="button"
                              className="admin-secondary-btn"
                              onClick={editingSignId ? handleCancelEdit : clearEditor}
                              disabled={signActionBusy || uploadBusy}
                            >
                              {editingSignId ? "Cancel Edit" : "Clear"}
                            </button>
                          </div>
                        </form>

                        {signActionError && (
                          <div className="admin-banner admin-banner-error">{signActionError}</div>
                        )}
                        {signActionMessage && (
                          <div className="admin-banner admin-banner-success">{signActionMessage}</div>
                        )}
                        {uploadError && (
                          <div className="admin-banner admin-banner-error">{uploadError}</div>
                        )}
                        {uploadMessage && (
                          <div className="admin-banner admin-banner-success">{uploadMessage}</div>
                        )}
                      </div>
                    </div>

                    </div>
                    <div className="admin-db-right">
                      <div className="admin-panel" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="admin-subsection" style={{ borderTop: 'none', margin: 0, padding: 0 }}>
                        <div className="admin-subsection-header">
                          <span className="insight-label">Video Assets</span>
                          <small>Tap one to auto-fill the video URL field</small>
                        </div>
                        <div className="asset-chip-grid">
                          {videoAssets.slice(0, 30).map((asset) => (
                            <button
                              type="button"
                              className="asset-chip"
                              key={asset.videoUrl}
                              onClick={() => handleAssetPick(asset)}
                            >
                              <strong>{asset.label}</strong>
                              <span>{asset.videoUrl}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="admin-subsection">
                        <div className="admin-subsection-header admin-search-header">
                          <span className="insight-label">Catalog Entries</span>
                          <input
                            type="text"
                            className="catalog-search-input"
                            value={adminSearchQuery}
                            onChange={(event) =>
                              setAdminSearchQuery(event.target.value)
                            }
                            placeholder="Search words or video paths..."
                          />
                        </div>
                        <div className="catalog-list">
                          {filteredAdminSigns.length > 0 ? (
                            filteredAdminSigns.map((sign) => (
                              <div
                                className={`catalog-row ${
                                  editingSignId === sign.id ? "catalog-row-active" : ""
                                }`}
                                key={sign.id}
                              >
                                <div className="catalog-copy">
                                  <strong>{sign.word}</strong>
                                  <span>{sign.videoUrl}</span>
                                </div>
                                <div className="catalog-actions">
                                  <button
                                    type="button"
                                    className="catalog-edit-btn"
                                    onClick={() => handleStartEdit(sign)}
                                    disabled={signActionBusy || uploadBusy}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="catalog-delete-btn"
                                    onClick={() => handleDeleteSign(sign.id)}
                                    disabled={signActionBusy || uploadBusy}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="catalog-empty-state">
                              No sign entries match this search.
                            </div>
                          )}
                        </div>
                      </div>

                      {adminSummary && (
                        <div className="admin-subsection">
                          <div className="admin-subsection-header">
                            <span className="insight-label">Recent Users</span>
                            <small>Latest registrations</small>
                          </div>
                          <div className="admin-user-list">
                            {adminSummary.latestUsers.map((user) => (
                              <div className="admin-user-row" key={user.id}>
                                <span>{user.name}</span>
                                <small>
                                  {user.email} - {user.role}
                                </small>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ) : (
                <p className="admin-error-copy" style={{textAlign: "center", marginTop: "2rem"}}>
                  {adminSummaryError || "Could not load admin dashboard"}
                </p>
              )}
            </main>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;
