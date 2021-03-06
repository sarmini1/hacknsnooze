"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//Function will display the story submission form, later used as a callback for when submit button is clicked
function navShowStoryForm(){ //update function name to something more nav-related
  console.log("loadStoryForm ran");
  $storyForm.slideToggle(); //adds in smooth motion between showing/hiding something
}

$navSubmit.on("click", navShowStoryForm);

function navFavoritesClick() {
  console.log("navfavs clicked");
  hidePageComponents();
  $allStoriesList.empty();
  for (let story of currentUser.favorites){
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

$navFavorites.on("click", navFavoritesClick);

// $(".navbar-brand").on("click", $navFavorites, navFavoritesClick);

// $("#nav-favorites").on("click", navFavoritesClick);

