// Stephen Hutchings (https://github.com/stephenhutchings)
// MIT License Copyright (c) 2014

var Exporter, sizes;

sizes = [
  {
    suffix: "",
    scale: 100
  }, {
    suffix: "@2x",
    scale: 200
  }
];

Exporter = {
  parentDir: Folder.selectDialog(),
  activeDoc: app.activeDocument,
  initialize: function() {
    var size, _i, _len;
    if (this.activeDoc && this.parentDir) {
      for (_i = 0, _len = sizes.length; _i < _len; _i++) {
        size = sizes[_i];
        this.exportArtboardsToFiles(size.scale, size.suffix);
      }
    }
  },
  exportArtboardsToFiles: function(scale, suffix) {
    var artboard, exportOptions, file, fileName, i, name, _i, _len, _ref, _scl;
    _ref = this.activeDoc.artboards;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      artboard = _ref[i];
      name = artboard.name;
      _scl = scale;
      if (name[0] === "-") {
        continue;
      }
      if (name.slice(-3) === "@2x") {
        _scl *= 0.5;
        name = name.slice(0, -3);
      }
      this.activeDoc.artboards.setActiveArtboardIndex(i);
      fileName = this.createFoldersFromName(name);
      file = new File(fileName + suffix + ".png");
      exportOptions = new ExportOptionsPNG24();
      exportOptions.transparency = true;
      exportOptions.artBoardClipping = true;
      exportOptions.antiAliasing = true;
      exportOptions.verticalScale = _scl;
      exportOptions.horizontalScale = _scl;
      this.activeDoc.exportFile(file, ExportType.PNG24, exportOptions);
    }
  },
  createFoldersFromName: function(name) {
    var dir, dirs, i, item, _i, _len, _ref;
    dirs = name.split("/");
    dir = null;
    _ref = dirs.slice(0, -1);
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      item = _ref[i];
      dir = new Folder(this.parentDir.fsName + "/" + dirs.slice(0, i + 1).join("/"));
      if (!dir.exists) {
        dir.create();
      }
    }
    return (dir || this.parentDir).fsName + "/" + dirs.pop();
  }
};

Exporter.initialize();
