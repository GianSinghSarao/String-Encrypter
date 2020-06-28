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