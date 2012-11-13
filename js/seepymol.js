seepymol = {
    applets: {},
    loaded: false,
}

var GLmol_chemicalobject_handler = function (json, element) {
    var id = 'GLMol-'+IPython.utils.uuid();
    var toinsert = $("<div/>").attr('id',id);
    element.append(toinsert);
    var src_id = id + '_src';
    element.append("<div/>").attr("style", "display: none")
    .val(json['pdb']);
    var glmol = new GLmol(id, false);
    glmol.loadMolecule();
    seepymol.applets[id] = glmol;
    alert(json['pdb']);
};

IPython.json_handlers.register_handler('ChemicalObject', GLmol_chemicalobject_handler);
