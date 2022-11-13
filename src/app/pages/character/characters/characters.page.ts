import { RickApiService } from 'src/app/services/rick-api.service'
import { RickAndMortyCharacter } from 'src/app/models/character.model'
import { RickAndMortyStatus } from 'src/app/models/status.model'
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
  private searchQuery: string = null
  currentPage = 1
  filter = Filter.All.valueOf()
  isSuggestionsAvailable = false
  suggestions = []

  constructor(
    private rickApiService: RickApiService,
    // private loadingCtrl: LoadingController,
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
    this.isSuggestionsAvailable = false
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
    this.isSuggestionsAvailable = true
    this.searchQuery = event.target.value
    if (event.target.value.length == 0) {
      this.getCharacters()
      return
    }
    const nameToSearch = event.target.value
    this.search(nameToSearch)
  }

  suggestionSelected(name: string) {
    this.isSuggestionsAvailable = false
    this.search(name)
  }

  private async search(nameToSearch: string) {    
    if (nameToSearch.length === 0) {
      this.infiniteScroll.disabled = true
      return
    }
    // const requestingDialog = await this.loadingCtrl.create({
    //   message: 'Requesting...',
    // })
    // await requestingDialog.present()
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
      // await requestingDialog.dismiss()
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

    // if the value is an empty string don't filter the items
    const query = this.searchQuery
    if (query && query.trim() !== '') {
        const allSuggestions = this._characters
          .filter((item) => {
              return (item.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
          })
          .map((item) => {
            return item.name
          })
          this.suggestions = [... new Set(allSuggestions)]
    } else {
        this.isSuggestionsAvailable = false
    }
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
