const Sign = require("../models/Sign")
const fallbackAlphabet = require("../utils/fallbackAlphabet")

async function mapWords(words){

let videoSequence = []

for(const word of words){

const sign = await Sign.findOne({word})

if(sign){

videoSequence.push(sign.videoUrl)

}else{

const letters = fallbackAlphabet(word)

for(const letter of letters){

const alphabetSign = await Sign.findOne({word:letter})

if(alphabetSign){
videoSequence.push(alphabetSign.videoUrl)
}

}

}

}

return videoSequence

}

module.exports = mapWords