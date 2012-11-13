#!/usr/bin/python
# -*- coding: utf-8 -*-

# Used to serialise MMTK primitives to objects that can be rendered by JsMol.
from seepymol.serialise import chemicalobject


_loaded = False

def load_ipython_extension(ip):
    '''
    Load the extension in IPython.
    '''
    global _loaded
    if not _loaded:
        # Get the formatter.
        mime = 'application/json'
        formatter = ip.display_formatter.formatters[mime]

        # Register handlers.
        formatter.for_type_by_name('MMTK.ChemicalObjects', 'ChemicalObject', chemicalobject)

        _loaded = True
