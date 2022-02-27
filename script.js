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
const avatars = document.querySelector('.avatars');
const registerPassword = document.querySelector('#register_password');
const confirmRegisterPassword = document.querySelector(
  '#confirm_register_password'
);
const inputFeedback = document.querySelector('.feedback_input');
const registerBtn = document.querySelector('.btn_register');

let users;
let usersCount = JSON.parse(localStorage.getItem('usersEver'))
  ? JSON.parse(localStorage.getItem('usersEver'))
  : 0;
let registeredUsers = Object.values(localStorage)
  .map((item) => JSON.parse(item))
  .filter((user) => typeof user === 'object');
let currentUser;
let posts;
let postBtn;
let postInput;
let logOutBtn;
let storedPosts;
let postsContainer;
let postsCount = JSON.parse(localStorage.getItem('postsEver'))
  ? JSON.parse(localStorage.getItem('postsEver'))
  : 0;

// CHECKING LOCAL STORAGE FOR DATA

const checkForPosts = function () {
  storedPosts = Object.values(localStorage)
    .map((item) => JSON.parse(item))
    .filter((post) => typeof post !== 'object' && typeof post !== 'number');

  storedPosts.forEach((post) => {
    postsContainer.insertAdjacentHTML('afterbegin', post);
    eventLike();
    checkForLikes();
  });
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
  inputFeedback.textContent = '';
});

showLogIn.addEventListener('click', function (e) {
  e.preventDefault();
  formLogIn.classList.remove('hide');
  formRegister.classList.add('hide');
  clearInputFields();
  inputFeedback.textContent = '';
});

//   USER CREATION

class User {
  constructor(name, pin, avatar) {
    this.name = name;
    this.pin = pin;
    this.id = usersCount;
    this.avatar = avatar;
  }
}

const createUser = function (userName, userPin, userAvatar) {
  const pin = userPin;
  const name = userName;
  const avatar = userAvatar;

  if (users.some((user) => user.name === `${name}`)) {
    inputFeedbackInfo('Username Exists!', 'red');
  } else if (name.split('').includes(' ')) {
    inputFeedbackInfo('Dont use spaces please!', 'red');
  } else if (name.length > 15) {
    inputFeedbackInfo('Name is too long!', 'red');
  } else if (pin.length < 6 || pin.length > 10) {
    inputFeedbackInfo(
      `Try a ${pin.length < 6 ? 'longer' : 'shorter'} password!`,
      'red'
    );
  } else {
    inputFeedbackInfo('Account created!', 'green');
    const newUser = new User(name, pin, avatar);
    usersCount++;

    localStorage.setItem('usersEver', `${usersCount}`);
    localStorage.setItem(`user${newUser.id}`, JSON.stringify(newUser));

    registeredUsers = Object.values(localStorage).map((user) =>
      JSON.parse(user)
    );
    checkForRegisteredUseres();
  }
};

registerBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const defaultAvatar = './img/ghost-solid.svg';
  const selectedAvatar = avatars.querySelector('.checked')
    ? avatars.querySelector('.checked').getAttribute('src')
    : defaultAvatar;
  if (registerPassword.value !== confirmRegisterPassword.value) return;
  createUser(registerUsername.value, registerPassword.value, selectedAvatar);
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
  window.addEventListener('beforeunload', clearLikeDislike);
};

// LOGING OUT

const logOut = function () {
  logOutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    clearLikeDislike();
    window.removeEventListener('beforeunload', clearLikeDislike);

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
    <div class="icon"> <img src="${currentUser.avatar}" alt="">
    </div>
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
  postsContainer = document.querySelector('.loged_posts');
};

const generatePosts = function () {
  postInput.value = '';
  postBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const generatePost = function (postMesage) {
      if (postMesage.length > 280 || postMesage.length < 1) return;
      const post = `<div id="${postsCount + 1}" class="post ${
        currentUser.name
      }">
        <p class="post_text">
          ${postMesage} - ${currentUser.name} <img class="post_img" src="${
        currentUser.avatar
      }" alt="">
        </p>
        <div class="post_options">
           <img class="like rate" src="./img/thumbs-up-solid.svg" alt="">
           <span class="like_count count">0</span>
           <img class="dislike rate" src="./img/thumbs-up-solid.svg" alt="">
           <span class="dislike_count count">0</span>
           <button class="btn del_post_btn">Delete post</button>
        </div>`;

      postsContainer.insertAdjacentHTML('afterbegin', post);
      localStorage.setItem(`post${postsCount + 1}`, JSON.stringify(post));
      postsCount++;
      localStorage.setItem('postsEver', `${postsCount}`);

      eventLike();
    };
    generatePost(`${postInput.value}`);
    postInput.value = '';
  });
};

const deletePost = function () {
  postsContainer.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('del_post_btn')) {
      if (!e.target.closest('.post').classList.contains(`${currentUser.name}`))
        return;
      localStorage.removeItem(`post${e.target.closest('.post').id}`);
      e.target.closest('.post').classList.add('op');
      setTimeout(() => {
        postsContainer.innerHTML = '';
        checkForPosts();
      }, 1000);
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
  avatars
    .querySelectorAll('.avatar')
    .forEach((avatar) => avatar.classList.remove('checked'));
}

const like = function (target) {
  const dislikeCount = target.closest('.post').querySelector('.dislike_count');
  const likeCount = target.closest('.post').querySelector('.like_count');
  target.closest('.post').classList.toggle(`likedby${currentUser.name}`);
  target.closest('.post').classList.remove(`dislikedby${currentUser.name}`);
  target.classList.toggle('checked');
  if (
    target
      .closest('.post')
      .querySelector('.dislike')
      .classList.contains('checked')
  ) {
    dislikeCount.textContent = +dislikeCount.textContent - 1;
  }
  target.closest('.post').querySelector('.dislike').classList.remove('checked');

  if (target.classList.contains('checked')) {
    likeCount.textContent = +likeCount.textContent + 1;
  } else {
    likeCount.textContent = +likeCount.textContent - 1;
  }
};

const dislike = function (target) {
  const dislikeCount = target.closest('.post').querySelector('.dislike_count');
  const likeCount = target.closest('.post').querySelector('.like_count');
  target.closest('.post').classList.toggle(`dislikedby${currentUser.name}`);
  target.closest('.post').classList.remove(`likedby${currentUser.name}`);
  target.classList.toggle('checked');
  if (
    target.closest('.post').querySelector('.like').classList.contains('checked')
  ) {
    likeCount.textContent = +likeCount.textContent - 1;
  }
  target.closest('.post').querySelector('.like').classList.remove('checked');

  if (target.classList.contains('checked')) {
    dislikeCount.textContent = +dislikeCount.textContent + 1;
  } else {
    dislikeCount.textContent = +dislikeCount.textContent - 1;
  }
};

const checkForLikes = function () {
  [...postsContainer.querySelectorAll('.post')].forEach((post) => {
    if (post.classList.contains(`likedby${currentUser.name}`)) {
      post.querySelector('.like').classList.add('checked');
    }
    if (post.classList.contains(`dislikedby${currentUser.name}`)) {
      post.querySelector('.dislike').classList.add('checked');
    }
  });
};

const clearLikeDislike = function () {
  [...postsContainer.querySelectorAll('.post')].forEach((post) => {
    post.querySelector('.like').classList.remove('checked');
    post.querySelector('.dislike').classList.remove('checked');

    localStorage.setItem(
      `post${post.id}`,
      JSON.stringify(`${post.outerHTML} `)
    );
  });
};

const selectAvatar = function () {
  avatars.addEventListener('click', function (e) {
    if (e.target.classList.contains('checked')) {
      e.target.classList.remove('checked');
    } else if (e.target.classList.contains('avatar')) {
      avatars
        .querySelectorAll('.avatar')
        .forEach((avatar) => avatar.classList.remove('checked'));

      e.target.classList.add('checked');
    }
  });
};

selectAvatar();

const inputFeedbackInfo = function (message, color) {
  inputFeedback.textContent = `${message}`;
  inputFeedback.style.color = `${color}`;
};
