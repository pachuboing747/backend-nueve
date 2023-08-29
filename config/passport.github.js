const GithubStrategy = require ("passport-github2")
const userManager = require ("../dao/managers/user.manager.js")
const { ClientID, ClientSecret, StrategyName} = require ("./config.password.js")

const githubAccess = {
    clientID : ClientID,
    clientSecret : ClientSecret,
    callBackURL: "http://localhost:8080/githubSessions"
};


const githubUsers = async (profile,done) => {
    console.log(profile)
    const {name, email} = profile._json;
    const _user = await userManager.getByEmail(email);

    if(!_user){
        console.log("usuario no encontardo")

        const newUser = {
            firstname : name.split(" ")[0],
            lastname : name.split(" ")[1],
            email: email,
            password: "",
            gender: "None",
        }

        const result = await userManager.create(newUser)
        return done(null,result)
    }
    console.log("El usuario ya existe")
    return done(null,_user)
}

const githubController = async(
    accessToken,
    refreshToken,
    profile,
    done
)=>{
    try{ 
        return await githubUsers(profile,done);
    }catch(error){
        done(error)
    }
}

module.exports = {
    GithubStrategy,
    githubAccess,
    githubController,
    strategyName: StrategyName,
}