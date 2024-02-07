import axios from 'axios'

// axios.defaults.baseURL = 'http:/localhost/5000/'
axios.defaults.baseURL = 'https://mykitchen-data-api.onrender.com/'
axios.interceptors.request.use(function(config){

    return config    
}, function(error){
    return Promise.reject(error);
}
)

axios.interceptors.response.use(function(response){
    return response
}, function(error){
    return Promise.reject(error);
})
