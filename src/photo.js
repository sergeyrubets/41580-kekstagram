'use strict';

var elementToClone = require('./elementToClone')();
var common = require('./common');
var utils = require('./utils');
var renderPictures = require('./renderPictures');
var Gallery = require('./gallery');
var gallery = new Gallery();

/** @type {number} */
var renderedPictureCount = 0;

/**
 * Конструктор, который создает превьюшку
 * @param {Object} data
 * @param {HTMLElement} container
 * @constructor
 */
function Photo(data, container) {
  this.data = data;
  this.element = container;
  this.img = null;
  this.prevIndex = 0;
}

/**
 * Функция создания одной превьюхи
 * @return {HTMLElement}
 */

Photo.prototype.getPhotoElement = function() {
  var element = elementToClone.cloneNode(true);
  this.img = new Image(182, 182);

  this.img.addEventListener('load', function() {
    successCallback(element, this.img);
  }.bind(this));

  this.img.addEventListener('error', function() {
    errorCallback(element);
  });

  this.img.src = this.data.url;
  element.querySelector('.picture-comments').textContent = this.data.comments;
  element.querySelector('.picture-likes').textContent = this.data.likes;

  this.element.appendChild(element);

  this.img.addEventListener('click', setHashPath);
  common.renderedPictures.push(this.data);

  return element;
};

function onLoadEndCallback() {
  renderedPictureCount++;

  if (renderedPictureCount === common.PAGE_SIZE) {
    if (utils.isBottom()) {
      renderPictures.render(common.filteredPictures, common.pageNumber, false);
      renderedPictureCount = 0;
    }

    gallery.togglePhoto();
  }
}

/**
 * При успешной загрузке изображения - добавляем ее на страничку
 * @param element
 * @param img
 */
function successCallback(element, img) {
  element.insertBefore(img, element.querySelector('.picture-stats'));
  onLoadEndCallback();
}

/**
 * При ошибке - вешаем класс ошибки
 * @param element
 */
function errorCallback(element) {
  element.classList.add('picture-load-failure');
  onLoadEndCallback();
}

/**
 * По клику на преьюшку сетим путь к картинке
 * в качестве хеш параметра  url
 * @param {MouseEvent} evt
 */
function setHashPath(evt) {
  evt.preventDefault();
  location.hash = evt.target.getAttribute('src');
}

module.exports = Photo;
