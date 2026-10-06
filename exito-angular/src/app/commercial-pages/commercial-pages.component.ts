import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

type CommercialPage = 'financiamento' | 'venda-seu-carro' | 'contato'

@Component({
  selector: 'app-commercial-pages',
  templateUrl: './commercial-pages.component.html',
  styleUrl: './commercial-pages.component.scss'
})
export class CommercialPagesComponent implements OnInit {
  readonly whatsappNumber = '5595984105024'
  page: CommercialPage = 'contato'
  vehicleValue = 80000
  downPayment = 15000
  months = 48
  tradeIn = { brand: '', model: '', year: '', mileage: '', name: '', phone: '', notes: '' }
  contact = { name: '', phone: '', email: '', message: '' }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.page = (this.route.snapshot.routeConfig?.path || 'contato') as CommercialPage
  }

  get estimatedPayment(): number {
    const financed = Math.max(0, Number(this.vehicleValue) - Number(this.downPayment))
    const rate = 0.018
    const months = Math.max(1, Number(this.months))
    return financed ? financed * rate / (1 - Math.pow(1 + rate, -months)) : 0
  }

  formatCurrency(value: number): string {
    return Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    })
  }

  sendFinancingRequest(): void {
    const message = [
      'Olá! Quero saber mais sobre financiamento:',
      `Valor do veículo: ${this.formatCurrency(this.vehicleValue)}`,
      `Entrada: ${this.formatCurrency(this.downPayment)}`,
      `Prazo: ${this.months} meses`,
      `Parcela estimada: ${this.formatCurrency(this.estimatedPayment)}`
    ].join('\n')
    this.openWhatsApp(message)
  }

  sendVehicleEvaluation(): void {
    if (!this.tradeIn.brand.trim() || !this.tradeIn.model.trim()) return
    const message = [
      'Olá! Quero vender meu carro:',
      `Marca: ${this.tradeIn.brand}`,
      `Modelo: ${this.tradeIn.model}`,
      this.tradeIn.year && `Ano: ${this.tradeIn.year}`,
      this.tradeIn.mileage && `Quilometragem: ${this.tradeIn.mileage} km`,
      this.tradeIn.name && `Nome: ${this.tradeIn.name}`,
      this.tradeIn.phone && `Telefone: ${this.tradeIn.phone}`,
      this.tradeIn.notes && `Observações: ${this.tradeIn.notes}`
    ].filter(Boolean).join('\n')
    this.openWhatsApp(message)
  }

  sendContactMessage(): void {
    const message = [
      'Olá! Entrei em contato pelo site da Êxito Multimarcas:',
      this.contact.name && `Nome: ${this.contact.name}`,
      this.contact.phone && `Telefone: ${this.contact.phone}`,
      this.contact.email && `E-mail: ${this.contact.email}`,
      this.contact.message && `Mensagem: ${this.contact.message}`
    ].filter(Boolean).join('\n')
    this.openWhatsApp(message)
  }

  private openWhatsApp(message: string): void {
    window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
  }
}