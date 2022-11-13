import { Component, OnInit } from '@angular/core'
import { RickAndMortyCharacter } from 'src/app/models/character.model'
import { RickApiService } from 'src/app/services/rick-api.service'
import { ActivatedRoute } from '@angular/router'
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx'

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.page.html',
  styleUrls: ['./character-details.page.scss'],
})
export class CharacterDetailsPage implements OnInit {
  character: RickAndMortyCharacter
  constructor(
    private activated: ActivatedRoute,
    private rickAndMortyService: RickApiService,
    private iab: InAppBrowser
  ) { }

  async ngOnInit() {
    const id = parseInt(this.activated.snapshot.paramMap.get('id') ?? '0', 10)
    this.character = await this.rickAndMortyService.getCharacter(id)
    console.log(this.character)
  }

  //planed to use for opening episodes
  launch(url: string) {
    console.log(url)
    const browser = this.iab.create(url)
    browser.show()
  }
}
