(function () {
  'use strict';

  /* 
   *100 buttons 
   */

  createButtons('.b-100-btns', 100);

  /*  */
  $('.b-100-btns__btn').on('click', function () {

    var target_btn = $(this);
    var modal = $('#renameBtnModal');

    modal.on('click', '#submit-modal', function(e) {      
        var btn_text = $('#btnText', modal);

        if (btn_text.val().length) {
          $(target_btn).text(btn_text.val())
        }
    });
  })

  /* 
   * GitHub Gist 
   */

  $.getJSON("https://api.github.com/gists/public", function(data) {
    var items = [];
    var item;

    $.each(data, function(key, val) {
      $.each(val.files, function(sub_key, file) {
        item = '<tr>';
        item = item.concat('<td>' + file.filename + '</td>');
        item = item.concat('<td>' + file.language + '</td>');
        item = item.concat('<td><a target="_blank" href="' + file.raw_url + '">' + 
          decodeURIComponent(file.raw_url) + '</a></td>');
        item = item.concat('</tr>');

        items.push(item);
      });
    });

    $("#gistFilesList").append(items.join(""));
  });

  /* 
   * Tree 
   */

  fillTree(10, 3, function(tree) {
    // console.log(tree);

    updateList(tree);

    var item;
    $('body').on('click', '.tree-btn', function() {
      var _id = $(this).data('id');
      if (_id === 'root') {
        updateList(tree);
      } else {

        var searched_item = _.find(tree, { 'id':  _id});
        if (typeof(searched_item) !== "undefined") {
          item = searched_item;
        } else {
          _.each(tree, function (child) {
            traverse(child, function(_item) {
              if (_item.id === _id) {
                item = _item;  
              }
              
              // console.log(item);
            });
          });

        }

        if (!$(this).data('parent')) {
          item.click = ++item.click;
        }

        updateList(item.next, item.parent_id);

      }


    });
  });

  /* Полезная ф-ия обхода дерева */
  function traverse(node, func) {
      if (func) {
        // console.log("123");
        func(node);
      }
      // console.log(node);

      _.each(node.next, function (child) {
          // console.log(child.id);
          traverse(child, func);
      });
  }

  /* Создаём 100 кнопок */
  function createButtons(target, num_buttons ) {
      for (var i=0; i < num_buttons; i++) {
          $(target).append('<button type="button" class="btn btn-default b-100-btns__btn"' + 
            'data-toggle="modal" data-target="#renameBtnModal" data-whatever="@mdo">Кнопка ' + i + '</button>');
      }
  }

  /* Заполняем дерево тестовыми данными */
  function fillTree(num_items, depth, callback) {
    var tree = [];
    
    for (var i=0; i < num_items; i++) {
      var _id1 = guid();
      var parent_id1 = 'root';

      tree[i] = {
        "id": _id1,
        "parent_id": parent_id1,
        "text": i+1,
        "click": 0,
        "next": []
      };

      for (var j=0; j < num_items; j++) {
        var _id2 = guid();
        var parent_id2 = _id1;

        tree[i].next[j] = {
          "id": _id2,
          "parent_id": parent_id2,
          "text": (i+1) + '.' + (j+1),
          "click": 0,
          "next": []
        };

        for (var k=0; k < num_items; k++) {
          var _id3 = guid();
          var parent_id3 = _id2;

          tree[i].next[j].next[k] = {
            "id": _id3,
            "parent_id": parent_id3,
            "text": (i+1) + '.' + (j+1) + '.' + (k+1),
            "click": 0,
            "next": []
          };
        }
      }
    }

    if (callback && typeof(callback) === "function") {
      callback(tree);
    } else {
      return tree;
    }
  }

  /* Обновляем список кнопок дерева */
  function updateList(items, parent_id) {
    $('#treeBtnList').empty();

    if (parent_id) {
      $('#treeBtnList').append('<li><button type="button" class="btn btn-default tree-btn" data-parent="true" data-id="'+ parent_id + '"><-</button></li>');
    }

    _.each(items, function(item) {
      $('#treeBtnList').append('<li><button type="button" class="btn btn-default tree-btn" data-id="'+ item.id + '">(' + 
        item.click + ') ' + item.text + ' -></button></li>');
    });
  }

  /* Генераци УИД`а */
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


})();





