1ST FACE:
    General tasks: 
        -Find a good name for the crypto coin if we dont want the name BlockFund
            Currently Blockfund, however if we want to create a new coin we'd not be able to use the name Blockfund
        -Find a good simplistic logo that has elements connected to the name(some same letter or any sape that is discribed in the title of our coin exaple: block shape from BlockFund)
            Currently placeholder logo
        -Create the coin using the guide from the blockchain course and discuss how many coins we will release to the public.
            Best to do after website is finished? (frontend)
    -Styling and functionalities for the website (at first without the hidden holder subpages).
        -start by organizing the files of the website
            Seems pretty organized now
        -add apropriate and discriptive naming for all the files and images(replace the src inside the code for any changes)
            to do
        -change the naming for the variables inside the code to match the circumstances and the use of each one
            to do
        more practical changes:
            -find/generate appropriate images (maching the colors and the simplistic style of the website)
            -start using less different fonts and font sizes and use as less as possible different 
            -fix the colors of elements(borders, fonts, buttons to match with the website main colors)
            -check and change if needed the sizes of the website elements.
            -check and fix the sizes to work in different laptop screen sizes(we will do the modile version later), we can check that using inspect in the browser.
            -Check and add(new if needed) the already existing text in all the pages(some text is placed randomly to capture space we have to change that) to be discriptive according to the titles(all the titles so far are correctly placed and discriptive).
            -change the styling of the subpages (not the index.html page) to be similar to the style of index html and also interacrive, simple and with the appropriate colors.
            -add smoother transitions animations to elements that have move or apppear when a button is pressed.
        Important: index.html, Learn.html, Participate.html -> only text, images, links etc....(not applications)
        Use.html -> text, images, links etc.... ++++++ swap application we will copy the swap application we used in the blockchain course (our proffesor has release the code on github ) but we have to adjust some changes we will make(we willuse only two coins(sepolia, blockfund) instead of 4 that our proffesor uses).
2ND FACE
    When we finish with all of that we can go further to the hidden subpages(that appear if a user of the websirte is a holder(his public key is on the list of the holders in etherscan website on the coin information)) and the login of the holders using the etherscan api.


Login with etherscan api:
    1. Put in public key    DONE
    2. Use API to check if key is a holder of coin
        2a. If yes, allow login
        2b. If not, do not allow login and display error message
    Like when someone login the login button to be replaced with a profile icon that when the user presses that to be able to see the persentage that holds and maybe the rank(that we will do later)