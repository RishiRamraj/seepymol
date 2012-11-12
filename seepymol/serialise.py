#!/usr/bin/python
# -*- coding: utf-8 -*-

# Used to serialise the data.
from zmq.utils import jsonapi
from MMTK.PDB import PDBOutputFile 
from StringIO import StringIO


def protein(protein):
    '''
    Serialises a MMTK protein.
    '''
    # Prepare the data and configuration.
    config = None
    universe = protein.universe()
    if universe is not None:
        config = universe.contiguousObjectConfiguration([protein])

    # Serialise the data.
    buffer = StringIO()
    file = PDBOutputFile(buffer)
    file.write(protein, config)

    # Retrieve the content.
    pdb = buffer.getvalue()
    file.close()

    # Store it in the json object that is sent to javascript.
    result = {'pdb': pdb}

    # Specify the javascript handler.
    result['handler'] = 'Protein'

    return jsonapi.dumps(result)
