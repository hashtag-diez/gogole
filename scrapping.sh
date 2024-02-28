#!/bin/bash

# Fonction pour scraper les informations de la page de recherche Gutenberg
scraper_gutenberg() {
    local query="$1"
    local search_url="https://www.gutenberg.org/ebooks/search/?query=$query"

    html_content=$(curl -s "$search_url")
    
    echo "$html_content"
    
    # Utilisation de grep pour extraire le contenu de la balise <li class="booklink">
    book_links=$(echo "$html_content" | grep -o '<li class="booklink">.*</li>')

    echo "$book_links"

    # Parcourir les résultats extraits pour chaque balise <li class="booklink">
    while IFS= read -r book_link; do
        # Utilisation de grep pour extraire le lien de la page du livre et le lien de l'image
        link_page=$(echo "$book_link" | grep -o 'href="[^"]*' | sed 's/href="//')
        link_image=$(echo "$book_link" | grep -o 'src="[^"]*' | sed 's/src="//')
        echo "$link_page $link_image"
    done <<< "$book_links"
}

# Liste des fichiers concernés (premier mot avant l'extension .txt)
fichiers=$(ls ./database/txts/ | sed 's/\.txt$//' | sed 's/:/%3A/g' | tr ' ' '+' | sed 's/,/%2C/g' |  head -n 20)

# Parcourir chaque fichier dans la liste
for fichier in $fichiers; do
    echo "Recherche du livre pour $fichier ..."
    # Scraper les informations de la page de recherche Gutenberg
    result=$(scraper_gutenberg "$fichier")
    # Vérifier si le résultat est non vide
    if [ -n "$result" ]; then
        # Séparer le résultat en lien de la page et lien de l'image
        read -r link_page link_image <<< "$result"
        echo "Livre trouvé pour $fichier :"
        echo "Page du livre : $link_page"
        echo "Lien de l'image : $link_image"
    else
        echo "Aucun livre trouvé pour $fichier."
    fi
done

echo "Terminé."
