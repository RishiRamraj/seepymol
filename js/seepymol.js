seepymol = {
    applets: {},
    loaded: false,
}

var GLmol_chemicalobject_handler = function (json, element) {
    var id = 'GLMol-'+IPython.utils.uuid();
    var toinsert = $("<div/>").attr('id',id);
    element.append(toinsert);
    var src_id = id + '_src';
    element.append("<textarea/>").attr("style", "display: none")
    .val(json['pdb']);
    var glmol = new GLmol(id);
    glmol.defineRepresentation = function() {
	var all = this.getAllAtoms();
	this.colorByAtom(all, {});
	this.colorByChain(all);
	var asu = new THREE.Object3D();
	this.drawCartoon(asu, all, this.curveWidth, this.thickness);
	this.modelGroup.add(asu);
    }; 
    glmol.loadMolecule();
    seepymol.applets[id] = glmol;
    alert(json['pdb']);
};

IPython.json_handlers.register_handler('ChemicalObject', GLmol_chemicalobject_handler);
