# String Encrypter
The result of following an ancient tutorial (Hooray for backwards compatibility!) about HTML Applications. Originally I had managed to compile it into an executable, but it no longer seems to work. In fact, most apps that claim to do this seem to have been updated to instead install the HTA and any resources to a temporary folder and launching it immediately.

## Producing an HTML Application with icon data
In the final iteration of a release, any dependencies, within reason, should be embedded. In my opinion this includes icons, but it can't be done for "plain text" apps, so I appended the icon onto the file (instead of embedding it within), Like so:
```batch
::In The Windows Command Prompt
copy /b assets\icon.ico+src\Encrypter.hta dist\Encrypter.hta
```
And I told the HTA that it is it's own icon. This ended up working well.