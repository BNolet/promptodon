require('dotenv').config()
const randomPrompt = require('./tools/randomPrompt')
const mastoapi = require('./tools/mastoapi.js')

console.log('✍️ promptodon is running!')

async function replyWithPrompt() {
    const notifications = await mastoapi.getNotifications(5)

    let toReply = notifications.filter(function(status) {
        if (status.content.includes(' /prompt') && repliedTo.some(i => i.id.includes(status.id)) === false){
            return true
        }
    })
    try {
        await toReply.map(async function(status) {
            let toMention
            if (status.mentions) {
                toMention = '@' + status.account.acct
                toMention = toMention.concat(' ' + status.mentions.map(x => '@' + x.acct).join(" "))
            } else {
                toMention = '@' + status.account.acct
            }
            console.log('replying')
            mastoapi.postStatus( toMention + ' ' + await randomPrompt.getRandomPrompt(), 'reply',status.visibility, status.id)
        })
        repliedTo = repliedTo.concat(toReply)
    } catch(err) {
        throw err
    }
}

async function postPrompt() {
    const post = await mastoapi.postStatus((await randomPrompt.getRandomPrompt()), 'post', 'public')
    console.log('posting')
    return post
}


mastoapi.clearNotifications()
let repliedTo = []
setInterval(() => {replyWithPrompt()},5000)
setInterval(() => {postPrompt()},86400000)
