const landing = document.querySelector('.user_interface');
const logedIn = document.querySelector('.app');
const showLogIn = document.querySelector('.login');
const showRegister = document.querySelector('.register');
const formLogIn = document.querySelector('.form_login');
const formRegister = document.querySelector('.form_register');
const logInUsername = document.querySelector('#login_username');
const logInPassword = document.querySelector('#login_password');
const logInBtn = document.querySelector('.btn_login');
const registerUsername = document.querySelector('#register_username');
const confirmRegisterPassword = document.querySelector(
  '#confirm_register_password'
);
const registerPassword = document.querySelector('#register_password');
const registerBtn = document.querySelector('.btn_register');

let users;
let registeredUsers = Object.values(localStorage)
  .map((item) => JSON.parse(item))
  .filter((user) => typeof user === 'object');
let currentUser;
let postsCont;
let posts;
let postBtn;
let postInput;
let logOutBtn;
let posted = [];
let storedPosts;
let postsIndex = JSON.parse(localStorage.getItem('postsEver'))
  ? JSON.parse(localStorage.getItem('postsEver'))
  : 0;

// CHECKING LOCAL STORAGE FOR DATA

const checkForPosts = function () {
  storedPosts = Object.values(localStorage)
    .map((item) => JSON.parse(item))
    .filter((post) => typeof post !== 'object' && typeof post !== 'number');
  if (storedPosts.length === 0) {
    posted = [];
  } else {
    posted = storedPosts;
    posted.forEach((post) => {
      postsCont.insertAdjacentHTML('afterbegin', post);
      eventLike();
      checkForLikes();
    });
  }
};

const checkForRegisteredUseres = function () {
  if (registeredUsers.length === 0) {
    users = [];
  } else {
    users = registeredUsers;
  }
};

checkForRegisteredUseres();

// SHOW SPECIFIC INPUT FIELD

showRegister.addEventListener('click', function (e) {
  e.preventDefault();
  formRegister.classList.remove('hide');
  formLogIn.classList.add('hide');
  clearInputFields();
});

showLogIn.addEventListener('click', function (e) {
  e.preventDefault();
  formLogIn.classList.remove('hide');
  formRegister.classList.add('hide');
  clearInputFields();
});

//   USER CREATION

class User {
  constructor(name, pin) {
    this.name = name;
    this.pin = pin;
    this.id = Math.floor(Math.random() * 100000);
  }
}

const createUser = function (userName, userPin) {
  const pin = userPin;
  const name = userName;

  if (users.some((user) => user.name === `${name}`)) {
    alert('Username already exists. Try with a different one! :D');
  } else if (name.split('').includes(' ')) {
    alert('Dont use spaces please! :D');
  } else if (pin.length < 6 || pin.length > 10) {
    alert(`Try a ${pin.length < 6 ? 'longer' : 'shorter'} password :D`);
  } else {
    const newUser = new User(name, pin);

    localStorage.setItem(`user${newUser.id}`, JSON.stringify(newUser));

    registeredUsers = Object.values(localStorage).map((user) =>
      JSON.parse(user)
    );
    checkForRegisteredUseres();
  }
};

registerBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (registerPassword.value !== confirmRegisterPassword.value) return;
  createUser(registerUsername.value, registerPassword.value);
  clearInputFields();
});

// LOGING IN

logInBtn.addEventListener('click', function (e) {
  e.preventDefault();
  LogIn(logInUsername.value, logInPassword.value);
});

const LogIn = function (userName, userPin) {
  const pin = userPin;
  const name = userName;

  if (!users.some((user) => user.name === `${name}`)) {
    alert('USER DOESNT EXIST');
    return;
  }

  currentUser = users.find((user) => user.name === `${name}`);

  if (currentUser.pin != pin) {
    alert('WRONG PASSWORD');
    return;
  }

  clearInputFields();

  landing.classList.add('hide');
  logedIn.classList.remove('hide');

  generateData();
  checkForPosts();
  generatePosts();
  deletePost();
  logOut();
};

// LOGING OUT

const logOut = function () {
  logOutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    currentUser = '';

    landing.classList.remove('hide');
    logedIn.classList.add('hide');
    logedIn.innerHTML = '';
  });
};

// DATA CREATION AND CONTENT LOADING

const generateData = function () {
  const logedUser = `
   <div class="info">
    <h1>Welcome, ${currentUser.name}</h1>
    <div class="icon"></div>
    <button class="btn logout">Log Out</button>
   </div>
   <div class="posts">
    <div class="post_input">
    <input
      placeholder="Write a thought! :D"
      type="text"
      class="post_mes"/>
    <button class="post_btn btn">Post!</button>
    </div><div class="loged_posts"></div>
   </div>`;

  logedIn.insertAdjacentHTML('afterbegin', logedUser);
  logOutBtn = document.querySelector('.logout');
  posts = document.querySelector('.posts');
  postBtn = document.querySelector('.post_btn');
  postInput = document.querySelector('.post_mes');
  postsCont = document.querySelector('.loged_posts');
};

const generatePosts = function () {
  postInput.value = '';
  postBtn.addEventListener('click', function (e) {
    clearInputFields();
    e.preventDefault();
    const generatePost = function (postMesage) {
      if (postMesage.length > 280 || postMesage.length < 1) return;
      const post = `<div id="${postsIndex + 1}" class="post ${
        currentUser.name
      }">
        <p class="post_text">
          ${postMesage} - ${currentUser.name}
        </p>
        <div class="post_options">
          <div class="like rate">0</div>
          <div class="dislike rate">0</div>
          <button class="btn del_post_btn">Delete post</button>
          </div>`;

      postsCont.insertAdjacentHTML('afterbegin', post);
      localStorage.setItem(`post${postsIndex + 1}`, JSON.stringify(post));
      postsIndex++;
      localStorage.setItem('postsEver', `${postsIndex}`);

      eventLike();
    };
    generatePost(`${postInput.value}`);
  });
};

const deletePost = function () {
  postsCont.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('del_post_btn')) {
      if (!e.target.closest('.post').classList.contains(`${currentUser.name}`))
        return;
      e.target.closest('.post').classList.add('op');
      setTimeout(() => {
        e.target.closest('.post').classList.add('hide');
      }, 1000);
      localStorage.removeItem(`post${e.target.closest('.post').id}`);
    }
  });
};

const eventLike = function () {
  document.querySelector('.post').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('like')) {
      like(e.target);
    }
    if (e.target.classList.contains('dislike')) {
      dislike(e.target);
    }
    localStorage.setItem(
      `post${e.target.closest('.post').id}`,
      JSON.stringify(`${e.target.closest('.post').outerHTML} `)
    );
  });
};

// HELPERS

function clearInputFields() {
  registerUsername.value =
    registerPassword.value =
    confirmRegisterPassword.value =
    logInPassword.value =
    logInUsername.value =
      '';
}

const like = function (target) {
  target.closest('.post').classList.toggle(`likedby${currentUser.name}`);
  target.closest('.post').classList.remove(`dislikedby${currentUser.name}`);
  target.classList.toggle('checked');
  if (
    target
      .closest('.post')
      .querySelector('.dislike')
      .classList.contains('checked')
  ) {
    target.closest('.post').querySelector('.dislike').textContent =
      +target.closest('.post').querySelector('.dislike').textContent - 1;
  }
  target.closest('.post').querySelector('.dislike').classList.remove('checked');

  if (target.classList.contains('checked')) {
    target.textContent = +target.textContent + 1;
  } else {
    target.textContent = +target.textContent - 1;
  }
};

const dislike = function (target) {
  target.closest('.post').classList.toggle(`dislikedby${currentUser.name}`);
  target.closest('.post').classList.remove(`likedby${currentUser.name}`);
  target.classList.toggle('checked');
  if (
    target.closest('.post').querySelector('.like').classList.contains('checked')
  ) {
    target.closest('.post').querySelector('.like').textContent =
      +target.closest('.post').querySelector('.like').textContent - 1;
  }
  target.closest('.post').querySelector('.like').classList.remove('checked');

  if (target.classList.contains('checked')) {
    target.textContent = +target.textContent + 1;
  } else {
    target.textContent = +target.textContent - 1;
  }
};

const checkForLikes = function () {
  [...postsCont.querySelectorAll('.post')].forEach((post) => {
    if (post.classList.contains(`likedby${currentUser.name}`)) {
      return;
    } else {
      post.querySelector('.like').classList.remove('checked');
    }
    if (post.classList.contains(`dislikedby${currentUser.name}`)) {
      return;
    } else {
      post.querySelector('.dislike').classList.remove('checked');
    }
  });
};
