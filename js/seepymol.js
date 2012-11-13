var jmol_chemicalobject_handler = function (json, element) {
    var id = 'JsMol-'+IPython.utils.uuid();
    var toinsert = $("<div/>").attr('id',id);
    element.append(toinsert);

    alert(json['pdb']);
};

IPython.json_handlers.register_handler('ChemicalObject', jmol_chemicalobject_handler);
