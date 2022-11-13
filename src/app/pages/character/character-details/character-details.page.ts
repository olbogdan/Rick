import { Component, OnInit } from '@angular/core'
import { RickAndMortyCharacter } from 'src/app/models/character.model'
import { RickApiService } from 'src/app/services/rick-api.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.page.html',
  styleUrls: ['./character-details.page.scss'],
})
export class CharacterDetailsPage implements OnInit {
  character: RickAndMortyCharacter
  constructor(
    private activated: ActivatedRoute,
    private rickAndMortyService: RickApiService
  ) { }

  async ngOnInit() {
    const id = parseInt(this.activated.snapshot.paramMap.get('id') ?? '0', 10)
    this.character = await this.rickAndMortyService.getCharacter(id)
    console.log(this.character)
  }
}
