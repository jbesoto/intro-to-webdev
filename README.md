## Note

This repository uses **submodules** to organize and separate different 
projects clearly.

### Cloning

In order to clone this repository along with its submodules, use the 
following command:

```bash
git clone --recurse-submodules https://github.com/jbesoto/intro-to-webdev
```

This command clones the main repository and initializes and updates each 
submodule contained within it, ensuring you have all the necessary files 
and their correct versions.

### Initializing Submodules After Cloning

If you have already cloned the repository without its submodules, you 
can initialize and update the submodules by running the following 
command:

```bash
cd path/to/project/directory
git submodule update --init --recursive
```

This command initializes your local configuration file for each 
submodule, updates each submodule to the commit specified by the main 
repository, and recursively ensures all nested submodules are also 
updated and initialized.
