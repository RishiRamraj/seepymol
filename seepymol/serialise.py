#!/usr/bin/python
# -*- coding: utf-8 -*-

# Used to serialise the data.
from zmq.utils import jsonapi


def protein(protein):
    '''
    Serialises a MMTK protein.
    '''
    # Serialise the data to json format.
    result = {'test': 'See Py Mol. Py Mols well.'}

    # Specify the javascript handler.
    result['handler'] = 'Protein'

    return jsonapi.dumps(result)
