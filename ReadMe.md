# String Encrypter
![The program in action](https://user-images.githubusercontent.com/24685018/181739756-bda7b258-1825-4d28-8b14-23cff3f2b019.png)

## Contents
1. [Background](#background)
1. [Installation](#installation)
1. [Usage](#usage)
1. [Technologies Used](#technologies-used)
1. [Notes](#notes)
  - [Security Warning From Windows](#security-warning-1)
  - [Security Warning From Developer](#security-warning-2)
  - [HTML Application with icon data - Part 1](#producing-an-html-application-with-icon-data---part-1)
  - [Producing a single file program](#producing-a-single-file-program)
  - [HTML Application with icon data - Part 2](#producing-an-html-application-with-icon-data---part-2)
  - [Custom window chrome and lost features](#custom-window-chrome-and-lost-features)

## Background
The String Encrypter was initially the result of following a short tutorial-style article about a deprecated/obsolete tech stack. But now, it is the result of stretching an old tech stack to its limit.

[A more complete backstory is in the Wiki](https://github.com/GianSinghSarao/String-Encrypter/wiki/String-Encrypter-Backstory).

## Installation
As of now, there is no need to install the String Encrypter because it is a portable single-file program, but you could easily make a shortcut to it and place that in your start menu folder if you wanted to. 

## Usage
It's a largely self-explanatory program, but I might as well add this section, just in case you encounter some issues. 

First, you need the program. 

[You can download the latest version from the releases section of this repo.](https://github.com/GianSinghSarao/String-Encrypter/releases/latest) 

Once the download is complete, open the program.

[You will get a security warning, which you can safely ignore.](#security-warning-1) 

Type in some text you want encrypted or decrypted. 
Then, type in a password, and click the appropriate button. 

The result appears in the textbox which you initially typed in.

You can now do whatever you want with the encrypted/decrypted text. 

You can copy and send it to someone who knows the password to decrypt it, or you can just read through the decrypted text.

You could also print and fax it to someone many miles away to send a secret message or save it as a pdf and share it via the internet. 

**[Be warned that this program is pretty much just a toy, so it's cryptographic strength likely isn't very high.](#security-warning-2)**

## Technologies used
- `HTA` (Hyper-Text Application)
  - `mshta.exe` - The builtin HTA executable which runs the program
- `HTML` (always used `HTML5`)
- `CSS` (limited to `CSS1` or `CSS2` in the earlier versions)
- `JS` (limited to `ES3` in terms of syntax, but some modern features are used too)
- `WSH` (`ActiveXObject`s such as `WScript.Shell`)

## Notes

### Security Warning 1
The security warning occurs because the program is unsigned, which means there is no guarantee that the program was made by who you think made it. 

It could have been tampered with by a malicious third party. 

Unfortunately, due to the limitations of the tech, I cannot resolve this. 

However, as long as you download it from the releases section of this repo, it is trustworthy. 

### Security Warning 2
This program, despite its name, is not to be considered cryptographically secure.

The encryption algorithm in this program is copied almost verbatim from the program in the original article, albeit translated to javascript. 

I don't know the name of the algorithm used, nor do I know if it is good or not. 

The only security this program can provide is through obscurity. So don't use it for anything serious. 

### Producing an HTML Application with icon data - Part 1
In the final iteration of a release, any dependencies, within reason, should be embedded. In my opinion, this includes icons, so I prepended the icon before the file. Like so:
```batch
::In The Windows Command Prompt
copy /b assets\icon.ico+src\Encrypter.hta dist\Encrypter.hta
```
And I told the HTA that it is its own icon, which worked well.

### Producing a single-file program
Once a program is large or complex enough, having all the code in a single file becomes unmanageable.

However, my main goal was to ship only a single file as a portable executable. 

To make code easier to reason about, I needed to split my code.

To publish only a single file, I needed a build tool. 

So I made one. 

I made a simple script that combines the source files into a single HTA. 

I set it up as a VSCode task, but you could run it from the command line.
```batch
::You could use wscript instead, it has no effect on it's effectiveness.
cscript tasks\CombineSources.js
```
### Producing an HTML Application with icon data - Part 2
The prepending trick described above worked for earlier versions of the program but it wasn't perfect. 

Prepending the icon was causing `mshtml.dll` to skip the doctype declaration when parsing it, and this in turn was causing `mshta.exe` to execute the `HTA` in quirks mode,

So I needed a new solution.

I thought to myself:
> Since I already have a custom build tool, why not change it so it also embeds the images? 
>
> It'd need a new method instead of just prepending it but it could fix it. 

In [`v0.10.0`](https://github.com/GianSinghSarao/String-Encrypter/releases/tag/v0.10.0), I managed to create a new build tool based on the last, but because this one was actually packing the icon, instead of just prepending it, I decided to rename it. 
```batch
::You could use wscript instead, it has no effect on it's effectiveness.
cscript tasks\Compile.js
```


### Custom window chrome and lost features
The borders and titlebar of a window are considered the chrome of the window. 

In modern applications it is a given that they are themed according to the system colour scheme. 

When using HTAs, the programmer has to choose to either create entirely custom chrome or to just use the default chrome. 

It isn't possible to pick and choose styles like one could when using Windows Forms and DWM APIs. Because HTAs don't have access to DWM, many odd hacks and reimplementations have to be done to get the bare minimum, and features are lost. 

For example, the context menu, with options like Close, Resize, and Move. This is now gone. It is still technically posible to reimplement, so feel free to do it, and make a pull request if you can, but for now it is gone.

Other features sacrificed for the custom chrome are aero snap and the context menu leading to the print window (but `CTRL + P` still works).