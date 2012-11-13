seepymol = {
    applets: {},
    loaded: false,
}

var Info = {
	width: 300,
	height: 300,
	debug: false,
	color: "white",
	addSelectionOptions: true,
	jarPath: "..",
	j2sPath: "j2s",
}

var jmol_chemicalobject_handler = function (json, element) {
    var id = 'JsMol-'+IPython.utils.uuid();
    var toinsert = $("<div/>").attr('id',id);
    element.append(toinsert);
    var jmol = Jmol.getApplet(id, Info);
    jmol._loadModel(json['pdb']);
    seepymol.applets[id];
    alert(json['pdb']);
};

IPython.json_handlers.register_handler('ChemicalObject', jmol_chemicalobject_handler);
