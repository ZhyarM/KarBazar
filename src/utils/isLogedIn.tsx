function isLogedIn() {
    if (localStorage.getItem("LoginUsertoken")) {
      return true;
    } else {
      return false;
    }
  }
  
  export { isLogedIn 
}