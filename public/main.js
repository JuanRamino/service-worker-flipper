var ___VERSION___ = 1;

function IndexController(container) {
  this._container = container;
  this._registerServiceWorker();
  this._showVersion(___VERSION___);
}

IndexController.prototype._registerServiceWorker = function() {
  if (!navigator.serviceWorker) return;

  var indexController = this;
  
  navigator.serviceWorker.register('./sw.js').then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      indexController._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      indexController._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      indexController._trackInstalling(reg.installing);
    });
  });
};

IndexController.prototype._trackInstalling = function(worker) {
  var indexController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      indexController._updateReady(worker);
    }
  });
};

IndexController.prototype._updateReady = function(worker) {
  var toggleButtons = function() {
    document
      .querySelector('.update')
      .classList
      .toggle('hide');
  }

  toggleButtons();

  document.querySelector('.answer').addEventListener('click', function (event) {
    event.preventDefault();

    if(event.target.innerText === 'YES') {
      navigator.serviceWorker.ready.then(function() {
        window.location.reload();
      });

      return worker.postMessage({action: 'skipWaiting'});
    } else {
      toggleButtons();
    }

  }, false);
};

IndexController.prototype._showVersion = function(version) {
  var title = document.createElement('p');
  title.innerHTML = `VERSIONE <small>${version}</small><button class="update-sw">UPDATE SW</button>`;
  
  document
    .querySelector('.version')
    .appendChild(title);

  document.querySelector('.update-sw').addEventListener('click', function (event) {
    fetch('/update-version')
      .then(() => window.location.reload())
      .catch((err) => console.log(err));

  }, false);
};

new IndexController(document.querySelector('.main'));