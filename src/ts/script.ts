import charactersJSON from "./characters.json";
import sucessIcon from "../../public/icons/sucess-icon.png";
import errorIcon from "../../public/icons/error-icon.png";

type CharacterType = (number|string)[];

const characters = charactersJSON as CharacterType;
const passwordGeneratorForm = document.forms[0];
const passwordContainer = document.querySelector(".password-container");
const passwordContainerIcon = passwordContainer?.querySelector("img");
const outputPassword = passwordContainer?.querySelector(".password");


function createPopup(message: string, 
    icon: string) {
    const containerElement = document.querySelector(".popup-container");
    const iconElement = document.querySelector(".popup-container .popup-icon");
    const messageElement = document.querySelector(".popup-container .popup-message");
    const popupCloseCountdown = 2000;

    messageElement!.textContent = message;
    iconElement?.setAttribute("src", icon);

    return {
        
        show() {
            containerElement?.classList.add("visible");
        },
    
        close() {
            containerElement?.classList.remove("visible");
        },
    
        setMessage(message: string) {
            messageElement!.textContent = message;
        },
    
        setIcon(icon: string) {
            iconElement?.setAttribute("src", icon);
        },
    
        closeWithCountdown() {
            setTimeout(() => this.close(), popupCloseCountdown);
        }
    };
}


function getRandomCharacter(characters: CharacterType) {
    const charactersSize = characters.length;
    const randomCharacterIndex = Math.floor(Math.random() * charactersSize);
    const randomCharacter = characters[randomCharacterIndex];
    return randomCharacter;

}


function generatePassword(
    arraySize: number|null, 
    characters: (number|string)[]) : string {
        const passwordArray = Array.from({ length: arraySize! });

        
        return passwordArray
        .map(() => getRandomCharacter(characters))
        .reduce((prevValue, character) => 
        `${prevValue}${character}`)
        .toString();
}

function showPassword(password : string) {
    passwordContainer?.classList.add("visible");
    outputPassword!.textContent = password;
    
}

function copyPassword(password: string, sucess: () => void, error: () => void) {
    navigator.clipboard.writeText(password)
    .then(sucess)
    .catch(error);
}




passwordGeneratorForm.addEventListener("submit", e => {
    e.preventDefault();
    const passwordGeneratorFormData = new FormData(passwordGeneratorForm);
    const numberOfCharacters = 
    passwordGeneratorFormData.get("number-of-characters") as number|null;

    const randomPassword = generatePassword(numberOfCharacters, characters);
    showPassword(randomPassword);

    const generatedPasswordPopup = 
    createPopup("Senha gerada com sucesso :)", sucessIcon);
    generatedPasswordPopup.show();
    generatedPasswordPopup.closeWithCountdown();



    passwordContainerIcon?.addEventListener("click", () => {
        copyPassword(randomPassword, () => {
            const popup = createPopup("Senha copiada com sucesso :)", sucessIcon);
            popup.show();
            popup.closeWithCountdown();

        }, () => {
            const popup = createPopup("Erro ao copiar a senha :(", errorIcon);
            popup.show();
            popup.closeWithCountdown();
        });
    });
});


