var IdeaBox = (function() {
  
  "use strict";

  var form    = document.querySelector(".new-idea");
  var titleEl = document.querySelector("#title");
  var bodyEl  = document.querySelector("#body");
  var saveBtn = document.querySelector("#save");
  var search  = document.querySelector("#search");
  var ideasEl = document.querySelector(".ideas");

  var DATA = fetchData("ideas");

  function Idea(title, body) {
    this.id = DATA.length + 1;
    this.title = title;
    this.body = body;
    this.quality = "swill";
  }

  function fetchData(table) {
    return JSON.parse(localStorage.getItem(table)) || [];
  }

  function renderItem(state) {
    return `
    <div class="idea">
      <section class="idea-header">
        <h2>${state.title}</h2>
        <a class="idea-btn remove" href="#" data-operation="remove" data-id="${state.id}"></a>
      </section>

      <section class="idea-description">
        ${state.body}
      </section>

      <section class="idea-buttons">
        <a class="idea-btn upvote" href="#" data-operation="upvote" data-id="${state.id}"></a>
        <a class="idea-btn downvote" href="#" data-operation="downvote" data-id="${state.id}"></a>
        <small>quality: ${state.quality}</small>
      </section>
    </div>`;
  }

  function customNotice(value) {
    ideasEl.innerHTML = `<div class="no-ideas">${value}</div>`;
  }

  function render(data) {
    if(!data.length) {
      customNotice("Add some ideas...");
      return;
    }

    var output = "";
    
    data.forEach(function(idea) {
      output += renderItem(idea);
    });
    
    ideasEl.innerHTML = output;
  }

  function saveToLocalStorage(data) {
    localStorage.setItem("ideas", JSON.stringify(data));
  }

  function addItem(obj) {
    DATA.push(obj);
    saveToLocalStorage(DATA);
    render(DATA);
  }

  function formListener() {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
    });
  }


  function saveListener() {
    saveBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if(titleEl.value.length > 0 && bodyEl.value.length > 0) {
        addItem(new Idea(titleEl.value, bodyEl.value));
        form.reset();
      }
    });
  }


  function saveAndDisplay(data) {
    saveToLocalStorage(data);
    render(data);
  }

  function removeIdea(id) {
    DATA = DATA.filter(function(idea) {
      if(idea.id !== id) {
        return idea;
      }
    });

    saveAndDisplay(DATA);
  }

  function upvoteIdea(id) {
    DATA = DATA.filter(function(idea) {
      if(idea.id === id) {
        switch (idea.quality) {
          case "swill":
            idea.quality = "plausible";
            break;
          case "plausible":
            idea.quality = "genius";
            break;
          default:
            idea.quality = "genius";
        }
      }
      return idea;
    });
    
    saveAndDisplay(DATA);
  }

  function downvoteIdea(id) {
    DATA = DATA.filter(function(idea) {
      if(idea.id === id) {
        switch (idea.quality) {
          case "plausible":
            idea.quality = "swill";
            break;
          case "genius":
            idea.quality = "plausible";
            break;
          default:
            idea.quality = "swill";
        }
      }

      return idea;
    });
    
    saveAndDisplay(DATA);
  }


  function changeIdeaState(id, operation) {
    if(operation === "remove") {
      removeIdea(id);
    } else if(operation === "upvote") {
      upvoteIdea(id);
    } else {
      downvoteIdea(id);
    }
  }

  function ideaListeners() {
    ideasEl.addEventListener("click", function(e) {
      e.preventDefault();
      if(e.target.nodeName.toLowerCase() === "a") {
        var operation = e.target.dataset.operation;
        var id = +e.target.dataset.id;
        changeIdeaState(id, operation);
      }
    });
  }

  function filterItems(value) {
    var reg = new RegExp(value, "gi");

    var filtered = DATA.filter(function(idea) {
      if(idea.title.match(reg) || idea.body.match(reg)) {
        return idea;
      }
    });

    if(filtered.length !== 0) {
      render(filtered);
    } else {
      customNotice("No ideas match that term...");
    }
  }

  function searchListener() {
    search.addEventListener("keydown", function(e) {
      filterItems(this.value);
    });
  }

  function setupListeners() {
    formListener();
    saveListener();
    searchListener();
    ideaListeners();
  }

  function init() {
    setupListeners();
    render(DATA);
  }

  return {
    init: init
  }

})();

IdeaBox.init();
