seepymol
========

See IPython render molecules. Note that this code is very experimental.

## Dependencies

In order to have IPython recognise and execute your plugin, you will need to use the jsonhandlers branch of IPython created by Brian E. Granger. You can find it here: https://github.com/ellisonbg/ipython/tree/jsonhandlers.

As per the setup.py file you will need the MMTK. You may have trouble fetching this package from pypi. You can find the package here: http://dirac.cnrs-orleans.fr/MMTK/. The MMTK depends on the ScientificPython package, which you can find here: http://dirac.cnrs-orleans.fr/plone/software/scientificpython/.

## Installation

1. Install seepymol.
1. Under your static folder, create a folder called jsplugins.
    * Depending on your platform, this folder is in ~/.ipython/profile\_default/static or ~/.config/ipython/profile\_default/static.
1. Symlink the contents of the js folder into your jsplugins folder.
1. Activate WebGL in your browser.
1. Load the test notebook and run the example.
