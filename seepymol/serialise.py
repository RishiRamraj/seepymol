#!/usr/bin/python
# -*- coding: utf-8 -*-

# Used to serialise the data.
from zmq.utils import jsonapi
from MMTK.PDB import PDBOutputFile 
from StringIO import StringIO


def groupofatoms(groupofatoms):
    '''
    Serialises a MMTK protein.
    '''
    # Prepare the data and configuration.
    config = None
    universe = groupofatoms.universe()
    if universe is not None:
        config = universe.contiguousObjectConfiguration([groupofatoms])

    # Serialise the data.
    buffer = StringIO()
    file = PDBOutputFile(buffer)
    file.write(groupofatoms, config)

    # Retrieve the content.
    pdb = buffer.getvalue()
    file.close()

    # Store it in the json object that is sent to javascript.
    result = {'pdb': pdb}

    # Specify the javascript handler.
    result['handler'] = 'GroupOfAtoms'

    return jsonapi.dumps(result)
