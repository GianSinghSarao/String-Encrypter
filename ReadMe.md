![The program in action](https://user-images.githubusercontent.com/24685018/89825531-a1657600-db4c-11ea-85e6-65e2a1b28007.png)
# String Encrypter
Initially, The result of following an ancient tutorial (Hooray for backwards compatibility!) about HTML Applications, this experiment has grown more than I thought possible, and it seems it could still go much further. Originally I had managed to compile it into an executable, but it no longer seems to work.

## Producing an HTML Application with icon data
In the final iteration of a release, any dependencies, within reason, should be embedded. In my opinion this includes icons, but it can't be done for "plain text" apps, so I appended the icon onto the file (instead of embedding it within), Like so:
```batch
::In The Windows Command Prompt
copy /b assets\icon.ico+src\Encrypter.hta dist\Encrypter.hta
```
And I told the HTA that it is it's own icon. This ended up working well.

## Producing a single file program
There are a number of ways of achieving this: A self-extracting archive with the hta contained within, or for lightweight programs; simply inlining any needed resources, such as script and styles; or some other method, like downloading resources on first execution. I opted for inlining resources, so to help with this, I made a simple script that combines the source files into a single HTA. It is highly specific to this project, though it could easily be altered for others. It's setup as a vscode task, but can also be executed from the command line, or by double clicking it in explorer.
```batch
::You could use wscript instead, it has no effect on it's effectiveness.
cscript tasks\CombineSources.js
```

## Loss and Custom window chrome
The borders and titlebar of a window are considered the chrome of the window. In modern applications it is a given that they are themed according to the system colour scheme. When using HTAs, the programmer has to choose to either create entirely custom chrome or to just use the default chrome. It isn't possible to pick and choose styles like one could when using Windows Forms and DWM APIs. Because HTAs don't have access to DWM, many odd hacks and reimplementations have to be done to get the bare minimum, and features are lost. For example, the context menu, with options like Close, Resize, and Move. This is now gone. It is still technically posible to reimplement, so feel free to do it, and make a pull request if you can, but for now it is gone. Similarly, to prevent the window controls in the top right from being highlighted when the user tries to click them, Text selection was disabled. Other lost features are aero snap, and the context menu leading to the print window (but CTRL + P still works).
