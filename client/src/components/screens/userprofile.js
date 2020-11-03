import React,{useEffect,useState,useContext} from 'react'
import {useParams} from 'react-router-dom'
import {UserContext} from '../../App'
const Profile=()=>
{
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}=useContext(UserContext)
    const {userid}=useParams()
    const [showfollow,setShowfollow]=useState(state?state.followers.includes(userid):true)
    useEffect(()=>
    {
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>
            {
                //  console.log(result) 
                
                 setProfile(result)
            })
    },[])

    const followUser=()=>
    {
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
            .then(data=>{
        
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})    
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState)=>
                {
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }
                    }
                })
                setShowfollow(false)
            })
    }
    const unfollowUser=()=>
    {
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
            .then(data=>{
        
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})    
                localStorage.setItem("user",JSON.stringify(data))
                
                setProfile((prevState)=>
                {
                    const newFollower= prevState.user.followers.filter(item=>item!= data._id)
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower
                        }
                    }
                })
               setShowfollow(true)
            })
    }
    return(
        <>
        {userProfile?
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div className="pro">

                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid grey",
                }}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                            src={userProfile.user.pic}
                            alt="Network Problem"
                        />
                    </div>
                    <div>
                        <h5>
                         {userProfile.user.name}
                         </h5>
                         <h4>
                             {userProfile.user.email}
                         </h4>
                         <div style={{dispaly:"flex",justifyContent:"space-around",width:"100%"}}>
                            <h6>{userProfile.posts.length} Posts</h6>
                            <h6>{userProfile.user.followers.length}Followers</h6>
                            <h6>{userProfile.user.following.length}Following</h6> 
                         </div>
                         {
                             showfollow?<button style={{margin:"10px"}}className="btn waves-effect waves-light #f44336 red darken-1"
                                    onClick={()=>followUser()}>
                                    follow
                         </button>:
                         <button style={{margin:"10px"}}className="btn waves-effect waves-light #f44336 red darken-1"
                                    onClick={()=>unfollowUser()}>
                                    unfollow
                         </button>
                         }
                         
                         
                    </div>
                </div>
            </div>
            <div className="gallery">
            {
                userProfile.posts.map(item=>
                {
                    return(
                        <img key={item._id}className="item"src={item.photo} alt={item.title}/>
                    )
                })
            }
            </div>
        </div>
        :
        <h2>Loading...</h2>}
        </>
    )
}
export default Profile