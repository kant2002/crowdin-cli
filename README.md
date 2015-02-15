# crowdin-cli
Node.js CLI tool for the CrowdIn

## Downloading content
Download the translated content for the project. You could download specific language, or download all languages.

Use command below to download all translated content for the project configured in the ./crowdin.yaml file. Content will be saved in the `all.zip` 

    crowdin-cli download
    
Use `-o` parameter to change output file for the downloaded content.

    crowdin-cli download -o project_all.zip
    
Use `-l` parameter to download only selected language. Download only Russian language and save it to ru.zip.

    crowdin-cli download -l ru
    
You could use `-o` and `-l` together.

    crowdin-cli download -l ru -o project_ru.zip


## Exporting content
Crowdin cache translated content which could be downloaded. To be able to access the latest translation you have to export translation.
After that all subsequent copy for downloading will use same exported copy. 

Use command below to export content for the project configured in the ./crowdin.yaml file.

    crowdin-cli export
    
## Downloading glossary
You could download glossary which you create inside your CrowdIn project as a TBX file. 

Use command to save glossary as project.tbx file.

    crowdin-cli downloadGlossary
    
Use command below to save glossary as technical.tbx
    
    crowdin-cli downloadGlossary -o technical.tbx

    