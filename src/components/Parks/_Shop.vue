
<div class="columns">
  <div class="column">
    <div class="level">
      <div class="level-left">
        <h3 class="title level-item">Shops</h3>
        <a class="button level-item" v-if="isOwner()" @click="openModal('addShop')"><span class="icon"><i class="fas fa-plus"></i></span></a>
      </div>
    </div>

    <div class="card" v-for="shop in park.shops">
      <div class="card-content">
        <h5 class="title is-4">{{ shop.name }}</h5>
        <h6 class="subtitle is-5 has-text-grey">{{ shop.type }}</h6>
      </div>
    </div>

    <div class="card is-empty" v-if="isOwner() && park.shops.length == 0" @click="openModal('addShop')">
      <div class="card-content">
        <h5 class="title is-4">Add a Shop</h5>
      </div>
    </div>
  </div>

  <div class="column">
    <div class="level">
      <div class="level-left">
        <h3 class="title level-item">Attractions</h3>
        <a class="button level-item" v-if="isOwner()" @click="openModal('addAttraction')"><span class="icon"><i class="fas fa-plus"></i></span></a>
      </div>
    </div>

    <div class="card" v-for="attraction in park.attractions">
      <div class="card-content">
        <h5 class="title is-4">{{ attraction.name }}</h5>
        <h6 class="subtitle is-5 has-text-grey">{{ attraction.type }}</h6>
      </div>
    </div>

    <div class="card is-empty" v-if="isOwner() && park.attractions.length == 0" @click="openModal('addAttraction')">
      <div class="card-content">
        <h5 class="title is-4">Add an Attraction</h5>
      </div>
    </div>
  </div>


</div>


<Modal :class="{ 'addShop': true }" @close="closeModal('addShop')" :show="modalOpen('addShop')">
  <h1 class="title is-3">Add a Shop</h1>

  <div class="form">
    <div class="field is-grouped">
      <div class="control is-expanded">
        <label class="label">Shop Name</label>
        <input type="text" v-model="modals.addShop.data.name" class="input is-medium" />
      </div>
      <div class="control">
        <label class="label">&nbsp;</label>
        <Dropdown :alignRight="true">
          <button class="button is-medium is-dark" slot="trigger"><span>{{ modals.addShop.data.type || 'Choose Brand' }}</span> <span class="icon"><i class="far fa-chevron-down"></i></span></button>
          <div slot="menu">
            <a class="dropdown-item" @click="setModalData('addShop', 'type', tag.name)" v-for="tag in getTagGroup('shops')">{{ tag.name }}</a>
          </div>
        </Dropdown>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="label">Description</label>
        <textarea class="textarea" v-model="modals.addShop.data.description" rows="3"></textarea>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="label">Park Region</label>
        <input type="text" class="input is-medium" v-model="modals.addShop.data.region" />
      </div>
    </div>
    <div class="field">
      <a class="button is-primary is-medium">Save Shop</a>
    </div>
  </div>
</Modal>

<Modal :class="{ 'addAttraction': true }" @close="closeModal('addAttraction')" :show="modalOpen('addAttraction')">
  <h1 class="title is-3">Add an Attraction</h1>

  <div class="form">
    <div class="field">
      <div class="control">
        <div class="columns toggles">
          <div class="column"><a class="toggle is-box">Coaster</a></div>
          <div class="column"><a class="toggle is-box">Flat Ride</a></div>
          <div class="column"><a class="toggle is-box">Transport</a></div>
        </div>
      </div>
    </div>
    <div class="field is-grouped">
      <div class="control is-expanded">
        <label class="label">Name</label>
        <input type="text" class="input is-medium" />
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="label">Description</label>
        <textarea class="textarea" rows="3"></textarea>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="label">Demographic</label>
        <div class="columns toggles">
          <div class="column"><a class="toggle is-box">Teens</a></div>
          <div class="column"><a class="toggle is-box">Family</a></div>
          <div class="column"><a class="toggle is-box">Adults</a></div>
        </div>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="label">Park Region</label>
        <input type="text" class="input is-medium" />
      </div>
    </div>
    <div class="field">
      <a class="button is-primary is-medium">Save Attraction</a>
    </div>
  </div>
</Modal>
