<template lang="pug">

  full-screen
    span(slot="title") {{ $t('routes.site.terms.title') }}
    p.caption(slot="caption") {{ $t('routes.site.terms.caption') }}

    div
      h5  Impressum
      p DESIGN IN MAINZ
      p Hochschule Mainz
      p Studiengang Kommunikationsdesign
      p Holzstrasse 36, 55116 Mainz
      p Telefon: +49 (0) 61 31 - 628-2211
      p E-Mail: info (at) designinmainz.de

    div
      h5 Umsatzst.-Id-Nr.
      p DE 149 065 597

    div
      h5 Gesetzlicher Vertreter
      p Präsident der Hochschule, Prof. Dr.-Ing. Gerhard Muth

    div
      h5 Zuständige Aufsichtsbehörde
      p Ministerium für Wissenschaft
      p Weiterbildung und Kultur des Landes Rheinland-Pfalz
      p Mittlere Bleiche 61
      p 55116 Mainz

    div
      h5 Verantwortliche I. S. D. § 55 ABS. 2 RFSTV
      p Prof. Dr.-Ing. Gerhard Muth

    div
      h5 NEWS
      p Prof. Anna-Lisa Schönecker
      p Prof. Petra Eisele
      p Assistenz Kommunikationdesign

    div
      h5 SHOP
      p Marcel Backscheider
      p Dipl.-Des. Marcel Fleischmann

    div
      h5 SHOWCASE
      p Konzeption, Realisation und Administration
      p Dipl. Designer Matthias Schreiber
      p Dipl. Designer Melih Bilgil
      p Dipl. Inf. Thomas Lempa

    div
      h5 PROFILE
      p Projekt, Konzeption und Gestaltung
      p Prof. Anna-Lisa Schoenecker
      p Tatevik Aghababyan
      p Martina Camps y Espinoza
      h5 Fotografisches Konzept
      p Prof. Stefan Enders
      p Isabelle L?hr
      p Johanna G?ck
      h5 Copyright
      p Hochschule Mainz, Studiengang Kommunikationsdesign sowie die Autoren von Text und Bild.

    div
      h5 Credits
      p Gestaltung, Konzeption und Umsetzung der einzelnen Projekte von DESIGNINMAINZ:

    div
      h5 Rechtlicher Hinweis
      p Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschlie?lich deren Betreiber zust?ndig.

    div
      h5 Haftungsausschluss
      p Mit Urteil vom 12. Mai 1998 hat das Landgericht Hamburg entschieden, dass man durch die Ausbringung eines Links die Inhalte der gelinkten Seite ggf. mit zu verantworten hat. Dies kann - so das LG - nur dadurch verhindert werden, dass man sich ausdr?cklich von diesen Inhalten distanziert. Der Studiengang Kommunikationsdesign der Hochschule Mainz hat auf ihrer Website Links zu anderen Seiten im Internet gelegt. F?r alle diese Links gilt: Es wird ausdr?cklich betont, dass der Studiengang Kommunikationsdesign der Hochschule Mainz keinerlei Einfluss auf die Gestaltung und die Inhalte der verlinkten Seiten hat. Deshalb distanziert sich der Studiengang Kommunikationsdesign der Hochschule Mainz hiermit ausdrücklich von allen Inhalten aller gelinkten Seiten auf dieser Homepage und macht sich ihre Inhalte nicht zueigen. Diese Erklärung gilt für alle auf dieser Homepage ausgebrachten Links. Alle genannten Warenzeichen und Marken sind Besitz ihrer jeweilig registrierten Eigent?mer.
</template>

<script>
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  // import CenterCardThreeQuarter from '../../../components/shared/layouts/CenterCardThreeQuarter'
  export default {
    components: {
      // CenterCardThreeQuarter: CenterCardThreeQuarter
      FullScreen
    }
  }
</script>

<style></style>
