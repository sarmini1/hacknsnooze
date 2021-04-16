"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let starHTML = checkFavorites(story);
  console.log("generateStoryMarkup starHTML", starHTML)
  return $(`
      <li data-story-id="${story.storyId}">
        ${starHTML}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//Function below will retrieve data from the story submission form,
//then calls the .addStory method from the StoryList class to
// create a new story and add to page
async function submitNewStory(evt) {
  evt.preventDefault();

  const storyTitle = $("#title-field").val();
  const storyAuthor = $("#author-field").val();
  const storyURL = $("#url-field").val();

  let newStory = await storyList.addStory(
    currentUser,
    { title: storyTitle, author: storyAuthor, url: storyURL }
  );

  $allStoriesList.prepend(generateStoryMarkup(newStory));
}

$storyForm.on("submit", submitNewStory);

//when star is clicked, story is toggled between favorite/unfavorite.
//function needs to select the correct story to fav/unfav
//look at evt.target, look at closest li element --> take id, check state of fav/unfav and toggle, toggle star


//try using currentUser.favorites.find()
// function checkFavorites(story) {
//   console.log("checkFavorites input", story, currentUser.favorites)
//   if (currentUser !== undefined) {
//     for (let favorite of currentUser.favorites) {
//       if (favorite.storyId === story.storyId) {
//         return '<i class="fas fa-star"></i>'
//       } else {
//         continue;
//       }
//     }
//     return '<i class="far fa-star"></i>'
//   }
//   return "";
// }


// favorite => favorite.storyId === story.storyId

function checkFavorites(story) {
  if (currentUser !== undefined) {
    if (!!currentUser.favorites.find(favorite => favorite.storyId === story.storyId)) {
      return '<i class="fas fa-star"></i>'
    } else {
      return '<i class="far fa-star"></i>'
    }
  }
  return "";
  // for (let favorite of currentUser.favorites) {
  //   console.log(favorite.storyId)
  // }
  // // console.log(story.storyId)
  // return currentUser.favorites.find(favorite => favorite.storyId === story.storyId)
}

//toggles between favorite and unfavorite when star is clicked
async function toggleFavorites(evt) {
  evt.preventDefault();

  console.log("Toggle fav worked");
  console.log(evt.target)

  const selectedStoryId = $(evt.target).closest("li").data("story-id");

  console.log("selectedStoryId", selectedStoryId)

  let story = findStoryFromStoryId(selectedStoryId);
  console.log("found story", story)

  //currently using putStoriesOnPage to try to get it working
  if ($(evt.target).hasClass('fas')) {
    console.log('this is a favorite')
    await currentUser.unFavorite(story);
    putStoriesOnPage();
  } else {
    console.log('this is not a favorite')
    await currentUser.addFavorite(story);
    putStoriesOnPage();
  }
}

//takes a story id to find the story object
function findStoryFromStoryId(storyId) {
  for (let story of storyList.stories) {
    if (story.storyId === storyId) {
      return story;
    }
  }
}

//$(".fa-star").on("click", toggleFavorites);
$allStoriesList.on("click", ".fa-star", toggleFavorites)

//if currentUser === undefined, no stars show up. else, if story is in user favorites array, show filled in star, else show empty star.

/* <i class="far fa-star"></i>
<i class="fas fa-star"></i> */
