interface projectData{
    project_id: number;
    project_images: string[];

}

interface userData {
    id: number,
    available: boolean,
    topRated: boolean,
    cover_url: string;
    avatar_url: string;
    name: string;
    username: string;
    saves: number;
    typeOfBussiness: string;
    views: number;
    reviews: number;
    rating: number;
    projects: number;
    completed_projects: number;
    avg_prcing: string;
    response_time:number
    total_earnings: number;
    avgTime: number;
    bio: string;
    projects_Data: projectData[];
    experience: string;
    Email: string;
    Phone: string;
    Location: string;
    MemberSince: string;
    Website: string;
    skills: string[];
    languages: string[];
    certifications: string[];
    isViewer: boolean;
    isBussinessAccount: boolean;
}

// id : user id


// available : is user available for work , u should make a end point to for the user to change there availability status
// topRated: is the user top Rated
// cover_url: this is the background image of the user proile a  cover image should return the path of the cover image
// avatar_url: this is the user profile image this should return a path for the user proile
// name: this is the users actual name
// username this ithe username saved in the database
// saves: this is how many time other users saved or followed this user
// typeOfBussiness: this is the type of bussniness that this company do
// views: this is how many times that this profile has been seen u should make endpoint to save which user view this bussiness the end point should only count 1 view per one user open this profile
// NOTE: you should create a endpoint that changes all the above (available,cover_url,avatar_url,name,typeOfBussiness) the endpoint should be caipable to change one at a time or all together otherwise u have to make serval endpoints



// reviews: this is the amount
// rating: the user rating
// projects: number of projects the user have
// completed_projects:the number of completed projects
// avg_pricing: is the average price the bussiness charges there clients
// total_income the amount of money the user gained
// response_time: the expected amount of time the userd set for answing the clients
// avgTime: avg response of the user to clients
// NOTE: u should i have a endpoint to update (response_time , avg_pricing)
//







// bio: a about section of the user u should make a endpoint to update the bio
// project_Data: this should retrive a array that has 4 other array of time prjectData each having there own id and set of images paths the user should be able to only have 4 projects to show and he should be able to delete them at any time
// experience: this should retrive a string that the user set that talks about htere experience or who they worked with







//email: there bussniness email
//phone: bussiness phone number
// lcation: bussiness location
// memberSince : for how much time this account existed
// website: a link to there website bussiness website
// languages: how many langues dose ths bussniness have to offer to comiunicate with
// sertifications: this should retrive a array of images for the bussniness if they want to dsiplay the profetional certificates
//NOTE: a user should be able to do all the data basic operation with (email,phone,location,certificates,website and languages)






// isViewer: this returns a boolean telling me if the visiter of this profile is the owner of the profile or other users looking at it
// isBussinessAccount: this returns a boolean telling me if the accout that been should is bussiness account or just a normal client account 
// 
















