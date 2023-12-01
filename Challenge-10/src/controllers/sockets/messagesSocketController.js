import messageModel from "../../models/messages.models.js"

export async function messagesSocketController (io, info){
    await messageModel.create(info)
    const messages = await messageModel.find()
    io.emit('messages', messages)
}