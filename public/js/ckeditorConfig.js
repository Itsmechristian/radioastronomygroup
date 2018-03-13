if (window.location.pathname === "/user/upload") {
  var size = [750,580];
  window.addEventListener('resize', function() {
    window.resizeTo(size[0],size[1]);
  })
}
let url = window.location.href;
let id = url.substring(url.indexOf('edit') + 5, url.length)

if (window.location.pathname === "/user/create" || window.location.pathname === "/user/upload" || window.location.pathname === `/user/article/edit/${id}`) {
    CKEDITOR.replace("editor", {
      /* contentsCss: "body {font-size: 1re,; font-family: 'Open-Sans'; margin 10px;}", */
      resize_dir: "both",
      height: 400,
      resize_dir: "both",
      resize_minWidth: 200,
      resize_minHeight: 300,
      resize_maxWidth: 800,
      filebrowserBrowseUrl: "/user/upload",
      filebrowserWindowWidth : '750',
      filebrowserWindowHeight : '580',
    });
    CKEDITOR.on("dialogDefinition", function(ev) {
      var dialogName = ev.data.name;
      var dialogDefinition = ev.data.definition;

      if (dialogName == "image") {
        dialogDefinition.removeContents("advanced");
        dialogDefinition.removeContents("Link");

      }
    });

}