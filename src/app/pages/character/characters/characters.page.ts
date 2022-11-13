import { RickApiService } from 'src/app/services/rick-api.service'
import { RickAndMortyCharacter } from 'src/app/models/character.model'
import { RickAndMortyStatus } from 'src/app/models/status.model';
import { Component, OnInit, ViewChild } from '@angular/core'
import {
  InfiniteScrollCustomEvent,
  IonInfiniteScroll,
  LoadingController,
  SearchbarCustomEvent,
  ToastController,
} from '@ionic/angular'

enum Filter {
  All = 'All',
  Alive = 'Alive',
}

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss'],
})
export class CharactersPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll
  characters: RickAndMortyCharacter[]
  private _characters: RickAndMortyCharacter[]
  currentPage = 1
  filter = Filter.All.valueOf()

  constructor(
    private rickApiService: RickApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.getCharacters()
  }

  filterChanged(filter: string){
    console.log(filter)
    console.log(this.filter)
    this.filterCharacters()
  }

  async getCharacters(event?: InfiniteScrollCustomEvent) {
    try {
      this.setCharacters(await this.rickApiService
        .getCharacters()
        .then((response) => response.results)
      )
    } catch (err) {
      console.log(err)
      await (
        await this.toastCtrl.create({
          message: err,
          color: 'danger',
          duration: 4500,
        })
      ).present()
    } finally {
      if (event) {
        await event.target.complete()
      }
      this.infiniteScroll.disabled = false
    }
  }

  async searchByName(event: SearchbarCustomEvent) {
    if (event.target.value.length == 0) {
      this.getCharacters()
      return
    }
    const nameToSearch = event.target.value
    if (nameToSearch.length === 0) {
      this.infiniteScroll.disabled = true
      return
    }
    const requestingDialog = await this.loadingCtrl.create({
      message: 'Requesting...',
    })
    await requestingDialog.present()
    try {
      this.setCharacters(await this.rickApiService
        .getCharacters(nameToSearch)
        .then((response) => response.results)
      )
    } catch (err) {
      (
        await this.toastCtrl.create({
          message: err?.error?.error ?? err,
          color: 'danger',
          duration: 4500,
        })
      ).present()
    } finally {
      this.infiniteScroll.disabled = false
      await requestingDialog.dismiss()
    }
  }

  async loadMore(event: InfiniteScrollCustomEvent) {
    try {
      const newCharacters = await this.rickApiService
        .getCharacters('', this.currentPage + 1)
        .then((response) => response.results)
      this.appendCharacters(newCharacters)
      this.currentPage++
    } catch (err) {
      (
        await this.toastCtrl.create({
          message: err?.error?.error ?? err,
          color: 'danger',
          duration: 4500,
        })
      ).present()
      this.infiniteScroll.disabled = true
    } finally {
      await event.target.complete()
    }
  }

  private appendCharacters(chars: RickAndMortyCharacter[]) {
    this._characters.push(...chars)
    this.filterCharacters()
  }

  private setCharacters(chars: RickAndMortyCharacter[]) {
    this._characters = chars
    this.disableFilterForSingleItem()
    this.filterCharacters()
  }

  private disableFilterForSingleItem() {
    if (this._characters.length == 1) {
      this.filter = Filter.All
    }
  }

  private filterCharacters() {
    if (Filter.Alive.valueOf() == this.filter) {
      this.characters = this._characters.filter(character => character.status == RickAndMortyStatus.alive)
    } else {
      this.characters = this._characters
    }
  }
}
