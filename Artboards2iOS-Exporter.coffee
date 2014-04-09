# Stephen Hutchings (https://github.com/stephenhutchings)
# MIT License Copyright (c) 2014

sizes = [
  suffix: ""
  scale: 100
,
  suffix: "@2x"
  scale: 200
]

Exporter =
  parentDir: Folder.selectDialog()
  activeDoc: app.activeDocument

  initialize: ->
    if @activeDoc and @parentDir
      for size in sizes
        @exportArtboardsToFiles size.scale, size.suffix

    return

  exportArtboardsToFiles: (scale, suffix) ->
    for artboard, i in @activeDoc.artboards
      name = artboard.name

      # Artboards with a leading hyphen are ignored
      continue if name[0] is "-"

      # Assume that files already suffixed "@2x" are meant to be down-scaled
      # without a duplicate "@2x"
      if name.slice(-3) is "@2x"
        scale *= 0.5
        name = name.slice(0, -3)

      # Set the active artboard for "artBoardClipping" to apply
      @activeDoc.artboards.setActiveArtboardIndex i

      # The final directory structure and filename
      fileName = @createFoldersFromName(name)

      # Create the file with the resolution suffix
      file = new File(fileName + suffix + ".png")

      exportOptions = new ExportOptionsPNG24()
      exportOptions.transparency = true
      exportOptions.artBoardClipping = true
      exportOptions.antiAliasing = true
      exportOptions.verticalScale = scale
      exportOptions.horizontalScale = scale

      @activeDoc.exportFile file, ExportType.PNG24, exportOptions

    return

  # Contruct a folder for each that does not exist, starting from the
  # beginning of the heirarchy. Return the folder path and file name.
  createFoldersFromName: (name) ->
    dirs = name.split("/")
    dir = null

    for item, i in dirs.slice(0, -1)
      dir = new Folder(@parentDir.fsName + "/" + dirs.slice(0, i + 1).join("/"))
      dir.create() unless dir.exists

    return (dir || @parentDir).fsName + "/" + dirs.pop()

Exporter.initialize()
