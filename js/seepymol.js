seepymol = {
    applets: {},
    loaded: false,
}

var GLmol_groupofatoms_handler = function (json, element) {

    // Check for an exception.
    if ('__exception__' in json) {
        alert(json['__exception__']);
        return;
    }

    var id = 'GLMol-'+IPython.utils.uuid();
    var toinsert = $("<div/>").attr('id',id).attr('style', "width: 500px; height: 400px; background-color: white;");
    element.append(toinsert);

    var src_id = id + '_src';
    toinsert = $("<textarea/>").attr('id', src_id).val(json['pdb']).hide();
    element.append(toinsert);

    var glmol = new GLmol(id, true);
    seepymol.applets[id] = glmol;
    glmol.loadMolecule();
};

IPython.json_handlers.register_handler('GroupOfAtoms', GLmol_groupofatoms_handler);
