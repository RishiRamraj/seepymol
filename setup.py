#!/usr/bin/python
# -*- coding: utf-8 -*-
from setuptools import setup

version = '1.0.0'

long_description = '''
Lets iPython Notebook speak with JsMol to render molecules.
'''.replace('\n', '')

license = '''
Everyone is permitted to copy and distribute verbatim or modified 
copies of this license document, and changing it is allowed as long 
as the name is changed. 

        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

0. You just DO WHAT THE FUCK YOU WANT TO.

This program is free software. It comes without any warranty, to
the extent permitted by applicable law. You can redistribute it
and/or modify it under the terms of the Do What The Fuck You Want
To Public License, Version 2, as published by Sam Hocevar. See
http://sam.zoy.org/wtfpl/COPYING for more details.
'''.replace('\n', '')

setup(
    name='seepymol',
    version=version,
    description='See Py Mol',
    long_description=long_description,
    license=license,
    packages=[
        'seepymol',
    ],
    install_requires=[
        'MMTK',
    ],
)
