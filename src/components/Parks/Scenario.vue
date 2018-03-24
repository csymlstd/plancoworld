<template>
<div class="scenario">
    <div class="scenario-objectives">
        <div class="scenario-objectives--easy field">
            <div class="level">
            <div class="level-left">
                <h4 class="title is-4 level-item"><span class="icon level-item"><i class="fas fa-star" style="color:#A15E35;"></i></span></h4>
                <h4 class="title is-4 level-item">Easy </h4>
                <a class="button level-item" v-if="editMode" @click="addObjective('easy')">Add Objective</a>
            </div>
            </div>
            <div class="objective box" v-for="(objective, k) in scenario.objectives.easy" :key="k">
                <strong><Editable v-model="objective.objective" /> <span class="icon" @click="rm(k, scenario.objectives.easy)" v-if="editMode"><i class="fas fa-times"></i></span></strong>
                <ul class="objective-conditions">
                    <li v-for="(condition, c) in objective.conditions" :key="c"><Editable v-model="objective.conditions[c]" /> <span class="icon" @click="rm(c, objective.conditions)" v-if="editMode"><i class="fas fa-times"></i></span></li>
                    <li v-if="editMode"><Editable v-model="objective.conditions[c]" /> <span class="icon" @click="addCondition(objective.conditions)"><i class="fas fa-plus"></i></span></li>
                </ul>
                
            </div>
        </div>
        <div class="scenario-objectives--medium field">
            <h4 class="title is-4"><span class="icon"><i class="fas fa-star" style="color:#696869;"></i></span> Medium</h4>
        </div>
        <div class="scenario-objectives--hard field">
            <h4 class="title is-4"><span class="icon"><i class="fas fa-star" style="color:#E3A33D;"></i></span> Hard</h4>
        </div>
    </div>
</div>
</template>

<script>
import Editable from '@/components/ui/Editable'

export default {
    components: {
        Editable,
    },
    props: {
        model: {
            type: Object,
            default() {
                return {}
            }
        },
        editMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            scenario: {
                objectives: {
                    easy: [],
                    medium: [],
                    hard: [],
                }
            }
        }
    },
    watch: {
        scenario: {
            handler(updated) {
                this.$emit('update', updated)
            },
            deep: true,
        }
    },
    methods: {
        addObjective(key) {
            this.scenario.objectives[key].push({
                objective: 'New Objective',
                conditions: ['New Condition']
            })
        },
        addCondition(array) {
            array.push('New Condition')
        },
        rm(key, arr) {
            if(!arr) return false
            return arr.splice(key, 1)
        }
    },
    mounted() {
        this.scenario = Object.assign({},this.scenario, this.model)
    }
}
</script>