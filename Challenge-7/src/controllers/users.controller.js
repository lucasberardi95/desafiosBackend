export const postUser = async (req, res)=>{
    try {
        if(!req.user){
        return res.status(400).send({message: 'Existing user'})
        }
        res.redirect(`/static/login`) //Redirect
    } catch (error) {
        res.status(500).send({message: `Error creating user: ${error}`})
    }
}