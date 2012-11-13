seepymol = {
    applets: {},
    loaded: false,
}

var GLmol_chemicalobject_handler = function (json, element) {
    var id = 'GLMol-'+IPython.utils.uuid();
    var toinsert = $("<div/>").attr('id',id).attr('style', "width: 500px; height: 400px; background-color: black;");
    element.append(toinsert);

    var src_id = id + '_src';
    toinsert = $("<textarea/>").attr('id', src_id).val(json['pdb']).hide();
    element.append(toinsert);

    var glmol = new GLmol(id, true);
    seepymol.applets[id] = glmol;
    glmol.loadMolecule();
};

IPython.json_handlers.register_handler('ChemicalObject', GLmol_chemicalobject_handler);
