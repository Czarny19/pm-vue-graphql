# PM Vue GraphQL

### Prototyp aplikacji wykorzystującej technologie Vue.js i GraphQL

Obejmuje środowisko z graficznym edytorem pozwalającym na utworzenie i skonfigurowanie własnej aplikacji internetowej 
z wykorzystaniem gotowych komponentów, mechanizm ustalania motywu wizualnego, narzędzie definiowania 
akcji wykonywanych przez komponenty z wykorzystaniem zdefiniowanego źródła danych, bez potrzeby ręcznego 
pisania zapytań w języku SQL czy GraphQL oraz modułem wykonawczym odpowiedzialnym za realizację zadania minimalizacji 
kodu i będącym jednocześnie środowiskiem działania aplikacji.

## Założenia pracy

Wykorzystanie Vue, biblioteki Vuetify oraz języka GraphQL w systemach budowy aplikacji minimalizujących ilość 
kodu i automatyzujących tworzenie interfejsów użytkownika.

1. Analiza zagadnienia tworzenia aplikacji przy pomocy platform budowy aplikacji low-code.
2. Przegląd i analiza istniejących rozwiązań, określenie cech jakimi powinna charakteryzować się platforma budowy 
aplikacji low-code.
3. Koncepcja własnego rozwiązania wykorzystującego Vue oraz język GraphQL.
4. Projekt i implementacja prototypu rozwiązania obejmującego IDE z graficznym edytorem pozwalającym na tworzenie 
wyglądu aplikacji webowej z wykorzystaniem gotowych komponentów, mechanizmem ustalania tematu wizualnego, 
mechanizmem definiowania akcji wykonywanych przez komponenty z wykorzystaniem backendowej bazy danych, 
bez potrzeby tworzenia zapytań.
5. Projekt i implementacja biblioteki obsługującej zadanie minimalizacji kodu poprzez generowanie gotowego 
kodu aplikacji, zgodnie z wzorcami frameworku Vue i wykorzystując język GraphQL, na podstawie projektu użytkownika.

## Struktura projektu

1. `config/` - Paiet zawierający zrzuty schematów baz danych wykorzystywanych do osługi platformy oraz zrzuty 
przykładowej konfiguracji użytkownika
2. `src/assets/` - Style css wykorzystywane przez platformę
3. `src/components/` - Komponenty powszechnie wykorzystywane w aplikacji
   1. `widget/` - Komponenty generowane na widoku wynikowym projektu aplikacji w środowisku uruchomieniowym
4. `src/graphql/` - Konfiguracja GraphQL, biblioteka zapytań obsługi platformy
   1. `queries/datasource.ts` - Zapytania obsługi definicji źródła danych wprowadzanych przez użytkownika
   2. `queries/mutation.ts` - Zapytania obsługi definicji mutacji GraphQL zdefiniowanych przez użytkownika
   3. `queries/page.ts` - Zapytania obsługi definicji sron zdefiniowanych przez użytkownika
   4. `queries/project.ts` - Zapytania obsługi definicji projektu aplikacji użytkownika
   5. `queries/prop.ts` - Zapytania obsługi zmiennych strony tworzonej przez użytkownika
   6. `queries/query.ts` - Zapytania obsługi definicji zapytań GraphQL zdefiniowanych przez użytkownika
   7. `queries/schema.ts` - Zapytanie pobierające schemat bazy danych użytkownika
   8. `queries/theme.ts` - Zapytania obsługujące definicję kolorystyki aplikacji użytkownika
   9. `queries/user.ts` - Zapytania dotyczące obecnie zalogowanego użytkownika
5. `src/i18n/` - Tłumaczenia części administratorskiej systemu
6. `src/lib/` - Biblioteka skryptów wykorzystywanych podczas zadań generowania kodu aplikacji
7. `views/main` - Komponenty tworzące panel administratora do zarządzania projektami, motywami oraz źródłami danych 
8. `views/editor` - Komponenty tworzące edytor aplikacji wraz z zakładkami
9. `views/runtime` - Komponenty odpowiedzialne za generowanie i wyświetlanie interfejsu aplikacji użytkownika

![Alt text](readme/structure.png?raw=true "Project structure")

## Biblioteki genrowania zapytań i komponentów

TODO

## Instalacja
 
TODO

## Użytkowanie

### Panel startowy

Logowanie do aplikacji oraz rejestracja użytkownika przebiega przy pomocy auth0, możliwe jest także założenie nowego 
użytkownika.

![Alt text](readme/login.png?raw=true "Login")

Panel startowy zawiera zakładki Aplikacji, Motywów, Źródeł danych oraz skróty do edytorów dla utworzonych aplikacji.

![Alt text](readme/start.png?raw=true "Start")

### Motyw

![Alt text](readme/theme.png?raw=true "Theme")

Konfigurator motywu pozwala na wybranie zestawu 9 kolorów podstawowych aplikacji. Wybrane kolory zapisywane są w 
tabeli THEME. Podgląd kolorystyki odświeżany jest na żywo po zmianie jednego z kolorów.

### Źródło danych

![Alt text](readme/datasource.png?raw=true "Datasource")

Konfigurator źródła danych przymuje dane połączenie endpointu GraphQL - adres oraz sekret. Po wprowadzeniu danych
możliwe jest sprawdzenie połaczenia z endpointem, w przypadku błędu wyświetlany jest komunikat błędu GraphQL. Po prawej
stronie wyświetlany jest schemat bazy danych. Wyświetlane są wszystkie tabele wraz z ich polami, typami pól i 
wymagalnością. Wybrane źródło danych i dane połączenia zapisywane są w tabeli DATA_SOURCE.

### Projekt

![Alt text](readme/project.png?raw=true "Project")

Konfigurator projektu korzysta z uproszczonych wyglądów edytora motywu i źródła danych. Po wybraniu każdego z nich
wyświetlane są informacje podglądowe ułatwiające wybór. Każdy projekt aplikacji może posiadać wyłącznie jeden motyw i 
jedno źródło danych. Definicja projektu zapisywana jest w tabeli PROJECT.

### Edytor aplikacji

Edytor aplikacji składa się 5 zakładek, odpowiedzialnych za podział funkcjinalności dotyczących dostrajania aplikacji.

![Alt text](readme/settings.png?raw=true "Settings")

Zakładka 1 odpowiada za ustawianie opcji ogólnych aplikacji, takich jak uruchomienie aplikacji, wyznaczenie strony 
startowej aplikacji oraz ustawień górnego paska nawigacji. Strona startowa oraz nawigacja górna jest możliwa do 
skonfigurowanie po utworzeniu przynajmniej jednej strony aplikacji.

![Alt text](readme/pages.png?raw=true "Pages")

Zakładka stron wyświetla nazwę, identyfikator oraz datę modyfikacji strony. Każda ze stron może zostać otwarta w 
edytorze aplikacji lub usunięta.

![Alt text](readme/tables.png?raw=true "Tables")

Zakładka tabel wyświetla podgląd schematu bazy danych podobnie jak na ekranie konfiguracji źródła danych.

![Alt text](readme/queries.png?raw=true "Queries")

Zakładka zapytań, wyświetla zestaw wszystkich zapytań utworzonych dla wybranego źródła danych. Zapytania są 
współdzielone przez wszystkie aplikacje w celu ograniczenia nadmiarowości tworzonych zapytań. Wyświetlane są 
nazwa zapytania, data modyfikacji oraz opcje otwarcia edytora zapytania lub usunięcia zapytania.

![Alt text](readme/mutations.png?raw=true "Mutations")

Zakładka mutacji, wyświetla zestaw wszystkich mutacji czyli operacji zmiany danych utworzonych dla wybranego 
źródła danych. Mutacje są współdzielone przez wszystkie aplikacje w celu ograniczenia nadmiarowości tworzonych mutacji. 
Wyświetlane są nazwa mutacji, rodzaj operacji, data modyfikacji oraz opcje otwarcia edytora mutacji 
lub usunięcia mutacji.

### Edytor zapytań

Edytor zapytań został podzielony podzielony na formularze pozwalające na dostosowanie poszczególnych składowych
zapytania. Sposób tworzenia zapytania opisany został w sekcji 'Biblioteki genrowania zapytań i komponentów'.

![Alt text](readme/query_details.png?raw=true "Query Details")

Formlarz zapytania pozwala na ustawienie podstawowych informacji o zapytaniu, w tym jego nazwę, tabele oraz limit 
zwracanych wierszy zapytania.

![Alt text](readme/query_fields.png?raw=true "Query Fields")

Formularz pól pozwala na wybranie listy pól zwracanych jako wynik zapytania GraphQL. Pola wybierane są z tabeli po 
kliknięciu wybranego pola. Obecna jest także opcja wyboru wszystkich lub żadnego pola. Pola ograniczone są jedynie 
do pól samej tabeli i pól relacji obiektowych (jeden-do-jeden). Relacje tabelaryczne obłsugiwane są przy pomocy
komponentu kolumny.

![Alt text](readme/query_sort.png?raw=true "Query Sort")

Formularz sortowania pozwala na wybranie pól tabeli po których posortowany zostanie zestaw wynikowy zapytania.
Opcje sortowania pola to sortowanie rosnące i malejące dla każdego pola.

![Alt text](readme/query_vars.png?raw=true "Query Vars")

Formluarz zmiennych pozwala na zdefiniowanie zmienny wykorzystywanych przez zapytanie. Formularz pozwala na 
zdefiniowanie pola przy pomocy nazwy zmiennej, rodzaju zmiennej oraz przypisanej wartości stałej. Wartość stała
wykorzystywana jest podczas testowania zapytania oraz jako wartość domyślna zmiennej podczas uruchamiania zapytania
z poziomu wygenerowanej strony.

![Alt text](readme/query_where.png?raw=true "Query Where")

Formularz warunków pozwala na zdefiniowanie ograniczeń zapytania. Mozliwe jest utworzenie dowolnej liczby
warunków łączonych przy pomocy operatorów and i or. Kolejność wprowadzanych warunków wpływa na sposób ich łączenia
przy pomocy operatorów. Definicja pojedynczego warunku pozwala na wybranie pola tabeli, operatora sprawdzającego 
warunek, zmiennej która zostanie wstawiona podczas wywołania zapytania. Możliwa jest także opcja zaznaczenia pola 
jako wymagane lub opcjonalne. Opcja wymagana wstawia warunek do zapytania jedynie w przypadku gdy zmienna posiada 
przypisaną wartość.

![Alt text](readme/query_tester.png?raw=true "Query Tester")

Tester zapytania wyświetla wygenerowane zapytanie w czasie rzeczywistym, aktualizowane po wprowadzeniu każdej zmiany
w definicji zapytania. Generowane są również zmienne zapytania wraz z podstawionymi wartościami stałymi. Oba okna
z wygenerowanym kodem pozwalają na skopiowanie zapytania. Przycisk uruchom zapytanie generuje wersję właściwą zapytania
i uruchamia je przy pomocy odpowiednie biblioteki. Wynik zapytania lub błąd wywołania wyświetlany jest również 
w oknie testera w formacie JSON.

### Edytor mutacji

Edytor mutacji został podzielony podzielony na formularze pozwalające na dostosowanie poszczególnych składowych
mutacji. Skład formularzy zależny jest od wybranego rodzaju operacji. Dostępne operacje obejmują wstawianie, 
aktualizację, oraz usunięcie danych. Sposób tworzenia mutacji opisany został w sekcji 
'Biblioteki genrowania zapytań i komponentów'.

![Alt text](readme/mutation_details.png?raw=true "Mutation Details")

Formlarz zapytania pozwala na ustawienie podstawowych informacji o zapytaniu, w tym jego nazwę oraz tabelę. Wybór 
rodzaju operacji jest zablokowany i możliwy do wyboru jedynie podczas tworzenia nowej mytacji.

![Alt text](readme/mutation_vars.png?raw=true "Mutation Vars")

![Alt text](readme/mutation_where.png?raw=true "Mutation Where")

![Alt text](readme/mutation_fields.png?raw=true "Mutation Fields")

![Alt text](readme/mutation_tester.png?raw=true "Mutation Tester")

### Edytor strony

## Komponenty