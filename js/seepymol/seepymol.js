var jmol_protein_handler = function (json, element) {
    var id = 'JsMol-'+IPython.utils.uuid();
    var toinsert = $("<div/>").attr('id',id);
    element.append(toinsert);

    alert(json['test']);
};

IPython.json_handlers.register_handler('Protein', jmol_protein_handler)
