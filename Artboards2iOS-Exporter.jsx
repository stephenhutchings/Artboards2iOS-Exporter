// Stephen Hutchings (https://github.com/stephenhutchings)
// MIT License Copyright (c) 2014

var Exporter, sizes,
  __hasProp = {}.hasOwnProperty;

sizes = {
  standard: {
    suffix: "",
    scale: 100
  },
  retina: {
    suffix: "@2x",
    scale: 200
  }
};

Exporter = {
  parentDir: Folder.selectDialog(),
  activeDoc: app.activeDocument,
  initialize: function() {
    var size;
    if (this.doc && this.parentDir) {
      for (size in sizes) {
        if (!__hasProp.call(sizes, size)) continue;
        this.exportArtboardsToFiles(size.scale, size.suffix);
      }
    }
  },
  exportArtboardsToFiles: function(scale, suffix) {
    var artboard, exportOptions, file, fileName, i, name, _i, _len, _ref;
    _ref = this.doc.artboards;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      artboard = _ref[i];
      name = artboard.name;
      if (name[0] === "-") {
        continue;
      }
      if (name.slice(-3) === "@2x") {
        scale *= 0.5;
        name = name.slice(0, -3);
      }
      this.doc.artboards.setActiveArtboardIndex(i);
      fileName = this.createFoldersFromName(name);
      file = new File(fileName + suffix + ".png");
      exportOptions = new ExportOptionsPNG24();
      exportOptions.transparency = true;
      exportOptions.artBoardClipping = true;
      exportOptions.antiAliasing = true;
      exportOptions.verticalScale = scale;
      exportOptions.horizontalScale = scale;
      this.doc.exportFile(file, ExportType.PNG24, exportOptions);
    }
  },
  createFoldersFromName: function(name) {
    var dir, dirs, i, item, _i, _len, _ref;
    dirs = name.split("/");
    dir = null;
    _ref = dirs.slice(0, -1);
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      item = _ref[i];
      dir = new Folder(this.folder.fsName + "/" + dirs.slice(0, i + 1).join("/"));
      if (!dir.exists) {
        dir.create();
      }
    }
    return (dir || this.parentDir).fsName + "/" + dirs.pop();
  }
};

Exporter.initialize();
